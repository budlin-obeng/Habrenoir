/**
 * Arkesel SMS Gateway Integration Service
 * Documentation: https://sms.arkesel.com/api/v2/sms/send
 * Enables automated luxury client notification via SMS in Ghana & Worldwide.
 */

export const sendArkeselSMS = async ({ to, message, senderId = null }) => {
  const apiKey = process.env.ARKESEL_API_KEY;
  const sender = senderId || process.env.ARKESEL_SENDER_ID || 'HABRENOIR';

  // Format phone number (ensure international format without '+' for Arkesel, e.g. 233XXXXXXXXX)
  let cleanPhone = (to || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
    cleanPhone = '233' + cleanPhone.substring(1);
  }

  if (!apiKey || apiKey.trim() === '') {
    console.log(`\n--------------------------------------------------------------`);
    console.log(`[ARKESEL SMS SIMULATION · SENDER: ${sender}]`);
    console.log(`   To: +${cleanPhone}`);
    console.log(`   Message: "${message}"`);
    console.log(`   Notice: Configure ARKESEL_API_KEY in server/.env for live Ghana delivery.`);
    console.log(`--------------------------------------------------------------\n`);
    return {
      success: true,
      simulated: true,
      recipient: cleanPhone,
      message: 'Simulated SMS dispatch recorded.'
    };
  }

  try {
    const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: sender,
        message: message,
        recipients: [cleanPhone]
      })
    });

    const data = await response.json();
    console.log(`✓ Arkesel SMS Dispatched to +${cleanPhone}:`, data);
    return {
      success: response.ok,
      data
    };
  } catch (error) {
    console.error(`✕ Arkesel SMS dispatch error for +${cleanPhone}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * High-touch customer transactional SMS notifications
 */
export const notifyOrderPlacement = async ({ orderRef, customerName, phone, amount, currency = 'GHS' }) => {
  const greeting = customerName ? `Dear ${customerName}, ` : '';
  const message = `Habrenoir: ${greeting}Your order #${orderRef} for ${currency} ${Number(amount).toLocaleString()} has been sealed in our atelier ledger. White-glove courier dispatch scheduled. Track: habrenoir.luxury/track?order=${orderRef}`;
  return sendArkeselSMS({ to: phone, message });
};

export const notifyOrderStatusUpdate = async ({ orderRef, status, phone, customerName, trackingNumber }) => {
  const statusLabels = {
    pending: 'is awaiting final allocation',
    confirmed: 'has been authorized and reserved at the Accra atelier',
    benchwork: 'is currently undergoing master artisan benchwork & brass assembly',
    dispatched: `has been handed to diplomatic courier${trackingNumber ? ` (Waybill: ${trackingNumber})` : ''}`,
    delivered: 'has been delivered via white-glove courier. We thank you for choosing Habrenoir.'
  };

  const statusMsg = statusLabels[status] || `status is now updated to: ${status}`;
  const greeting = customerName ? `Dear ${customerName}, ` : '';
  const message = `Habrenoir: ${greeting}Your creation #${orderRef} ${statusMsg}. Inquiries: +233 30 294 8810.`;
  return sendArkeselSMS({ to: phone, message });
};

