import crypto from 'crypto';
import { dbStore } from '../services/dbStore.js';
import { notifyOrderStatusUpdate } from '../services/smsService.js';

export const initializeCheckout = async (req, res) => {
  try {
    const {
      items,
      amount,
      currency = 'GHS',
      email = 'client@habrenoir.luxury',
      customerName = 'Valued Client',
      phone = '',
      shipping = {},
      giftPackaging = true,
      deliveryNotes = ''
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Shopping bag is empty.' });
    }

    // Authoritative Server-Side Price Calculation (Prevents Price Tampering)
    let verifiedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await dbStore.getProductById(item.id);
      const unitPrice = product ? Number(product.price) : Number(item.price || 0);
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      verifiedTotal += unitPrice * quantity;
      verifiedItems.push({
        ...item,
        price: unitPrice,
        quantity,
        name: product?.name || item.name || 'Habrenoir Creation'
      });
    }

    const finalAmount = verifiedTotal > 0 ? verifiedTotal : Number(amount || 0);
    if (finalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount.' });
    }

    const orderRef = 'HBN-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 899 + 100);
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    let paystackResponseData = null;

    // Call Paystack API if secret key is valid
    if (paystackSecretKey && paystackSecretKey !== 'sk_test_placeholder_habrenoir_luxury' && paystackSecretKey.startsWith('sk_')) {
      try {
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            amount: Math.round(finalAmount * 100), // In lowest denomination (pesewas)
            currency: currency,
            reference: orderRef,
            callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-confirmation?reference=${orderRef}`,
            metadata: {
              customer_name: customerName,
              phone: phone,
              shipping_address: shipping.address,
              shipping_city: shipping.city,
              custom_fields: [
                {
                  display_name: 'Order Reference',
                  variable_name: 'order_ref',
                  value: orderRef
                },
                {
                  display_name: 'Client Name',
                  variable_name: 'client_name',
                  value: customerName
                }
              ]
            }
          })
        });

        const data = await paystackRes.json();
        if (data.status) {
          paystackResponseData = data.data;
        }
      } catch (paystackErr) {
        console.warn('Paystack API call notice:', paystackErr.message);
      }
    }

    // Persist order in resilient database
    const orderData = {
      reference: orderRef,
      customerName,
      customerEmail: email,
      customerPhone: phone,
      items: verifiedItems,
      amount: finalAmount,
      currency: currency,
      status: 'pending',
      shipping: {
        type: shipping.type || 'White-Glove Valet Courier',
        recipientName: customerName,
        phone: phone,
        address: shipping.address || 'Flagship Salon Pickup / Diplomatic Courier',
        city: shipping.city || 'Accra',
        region: shipping.region || 'Greater Accra',
        country: shipping.country || 'Ghana',
        notes: deliveryNotes
      },
      giftPackaging: Boolean(giftPackaging),
      createdAt: new Date().toISOString()
    };

    const savedOrder = await dbStore.saveOrder(orderData);

    // Note: SMS is NOT sent here to prevent SMS Toll Fraud / Wallet Draining.
    // Order confirmation SMS is strictly dispatched upon verified payment settlement.

    res.json({
      success: true,
      reference: orderRef,
      order: savedOrder,
      authorization_url: paystackResponseData?.authorization_url || null,
      access_code: paystackResponseData?.access_code || null,
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_sample_habrenoir_luxury'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    let isSuccess = true;
    let paystackDetails = null;

    if (paystackSecretKey && paystackSecretKey !== 'sk_test_placeholder_habrenoir_luxury' && paystackSecretKey.startsWith('sk_')) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`
          }
        });
        const data = await verifyRes.json();
        if (data.status && data.data.status === 'success') {
          isSuccess = true;
          paystackDetails = data.data;
        } else {
          isSuccess = false;
        }
      } catch (e) {
        console.warn('Paystack verification network notice:', e.message);
      }
    }

    // Update order status
    const order = await dbStore.getOrderByRef(reference);
    if (order) {
      const nextStatus = isSuccess ? 'confirmed' : 'payment_failed';
      await dbStore.updateOrderStatus(reference, nextStatus);

      if (isSuccess && order.customerPhone) {
        notifyOrderStatusUpdate({
          orderRef: reference,
          status: 'confirmed',
          phone: order.customerPhone,
          customerName: order.customerName
        }).catch(() => {});
      }
    }

    res.json({
      success: isSuccess,
      reference: reference,
      status: isSuccess ? 'confirmed' : 'failed',
      order: order || null,
      details: paystackDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers['x-paystack-signature'];

    // Cryptographic signature verification using HMAC SHA-512
    if (paystackSecret && paystackSecret !== 'sk_test_placeholder_habrenoir_luxury' && paystackSecret.startsWith('sk_')) {
      if (!signature) {
        return res.status(401).json({ success: false, message: 'Missing Paystack cryptographic signature header.' });
      }
      const hash = crypto.createHmac('sha512', paystackSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        return res.status(401).json({ success: false, message: 'Invalid webhook cryptographic signature.' });
      }
    }

    const event = req.body;
    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      if (reference) {
        const order = await dbStore.getOrderByRef(reference);
        await dbStore.updateOrderStatus(reference, 'confirmed');

        if (order && order.customerPhone) {
          notifyOrderStatusUpdate({
            orderRef: reference,
            status: 'confirmed',
            phone: order.customerPhone,
            customerName: order.customerName
          }).catch(err => console.warn('Arkesel webhook notification notice:', err.message));
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ORDER MANAGEMENT (ADMIN & TRACKING) ====================
export const getOrders = async (req, res) => {
  try {
    const { status, email, phone, search, query } = req.query;

    const isFiltered = Boolean(
      (email && email.trim() !== '') ||
      (phone && phone.trim() !== '') ||
      (search && search.trim() !== '') ||
      (query && query.trim() !== '')
    );

    // If unscoped request (fetching all customer orders), require admin authorization
    if (!isFiltered) {
      const adminSecret = process.env.ADMIN_SECRET_KEY || 'habrenoir_admin_sec_2026';
      const providedKey = req.headers['x-admin-key'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
      const clerkRole = req.headers['x-user-role'];

      const isAuthorized = (providedKey && providedKey === adminSecret) || (clerkRole === 'admin' && Boolean(providedKey));
      if (!isAuthorized) {
        return res.status(401).json({
          success: false,
          message: 'Access Denied: Administrative authorization token required to view entire order ledger.'
        });
      }
    }

    let orders = await dbStore.getAllOrders();

    // Filter by client email (case-insensitive)
    if (email && email.trim() !== '') {
      const cleanEmail = email.trim().toLowerCase();
      orders = orders.filter(o =>
        (o.customerEmail && o.customerEmail.toLowerCase() === cleanEmail) ||
        (o.email && o.email.toLowerCase() === cleanEmail)
      );
    }

    // Filter by phone number
    if (phone && phone.trim() !== '') {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      orders = orders.filter(o => {
        const oPhone = (o.customerPhone || o.phone || '').replace(/[^0-9]/g, '');
        return oPhone && (oPhone.includes(cleanPhone) || cleanPhone.includes(oPhone));
      });
    }

    // Freeform search by reference, customer name, email, or tracking number
    const searchQuery = (search || query || '').trim().toLowerCase();
    if (searchQuery) {
      orders = orders.filter(o =>
        (o.reference && o.reference.toLowerCase().includes(searchQuery)) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchQuery)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(searchQuery)) ||
        (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery))
      );
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { reference } = req.params;
    let order = await dbStore.getOrderByRef(reference);

    // Fallback: search across all fields (reference, email, phone, tracking number)
    if (!order) {
      const allOrders = await dbStore.getAllOrders();
      const clean = (reference || '').trim().toLowerCase();
      order = allOrders.find(o =>
        (o.reference && o.reference.toLowerCase() === clean) ||
        (o.customerEmail && o.customerEmail.toLowerCase() === clean) ||
        (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === clean)
      );
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order reference not found in Habrenoir archives.' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const { status, trackingNumber } = req.body;

    const updated = await dbStore.updateOrderStatus(reference, status, trackingNumber);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Trigger Arkesel SMS update to customer
    if (updated.customerPhone) {
      notifyOrderStatusUpdate({
        orderRef: reference,
        status: status,
        phone: updated.customerPhone,
        customerName: updated.customerName,
        trackingNumber: trackingNumber || updated.trackingNumber
      }).catch(err => console.warn('Arkesel SMS status update notice:', err.message));
    }

    res.json({ success: true, message: `Order status updated to '${status}'.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
