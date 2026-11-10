import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts } from '../data/products.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

class ResilientDataStore {
  constructor() {
    this.products = [];
    this.orders = [];
    this.inquiries = [];
    this.isMongoActive = false;
    this.init();
  }

  init() {
    // 1. Load from store.json if exists
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.products = Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : [...initialProducts];
        this.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
        this.inquiries = Array.isArray(parsed.inquiries) ? parsed.inquiries : [];
      } else {
        this.products = [...initialProducts];
        this.orders = [];
        this.inquiries = [];
        this.saveToFile();
      }
    } catch (e) {
      console.warn('! Notice reading persistent store.json, using defaults', e);
      this.products = [...initialProducts];
      this.orders = [];
      this.inquiries = [];
    }
  }

  saveToFile() {
    try {
      const data = {
        updatedAt: new Date().toISOString(),
        productsCount: this.products.length,
        ordersCount: this.orders.length,
        inquiriesCount: this.inquiries.length,
        products: this.products,
        orders: this.orders,
        inquiries: this.inquiries
      };
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write to store.json', e);
    }
  }

  setMongoStatus(active) {
    this.isMongoActive = active;
  }

  // ==================== PRODUCTS ====================
  async getAllProducts() {
    if (this.isMongoActive) {
      try {
        let dbProducts = await Product.find({}).lean();
        
        // Auto-heal/sync if catalog is empty or if documents have missing image fields
        const hasMissingImages = dbProducts && dbProducts.length > 0 && dbProducts.some(p => !p.image);
        if (!dbProducts || dbProducts.length === 0 || hasMissingImages) {
          for (const p of this.products) {
            await Product.findOneAndUpdate(
              { id: p.id },
              { $set: p },
              { upsert: true, new: true }
            );
          }
          dbProducts = await Product.find({}).lean();
          console.log(`✓ Synchronized ${dbProducts.length} Habrenoir creations with complete images and attributes in MongoDB.`);
        }

        if (dbProducts && dbProducts.length > 0) {
          return dbProducts;
        }
      } catch (e) {
        console.warn('! Notice loading products from MongoDB, falling back to local file store', e.message);
      }
    }
    return this.products;
  }

  async getProductById(id) {
    if (this.isMongoActive) {
      try {
        const product = await Product.findOne({ id }).lean();
        if (product) return product;
      } catch (e) {}
    }
    return this.products.find(p => p.id === id) || null;
  }

  async addProduct(newProductData) {
    // Assign unique id if not provided
    const id = newProductData.id || ('hbn-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6));
    if (newProductData.price && !newProductData.formattedPrice) {
      newProductData.formattedPrice = `GH₵ ${Number(newProductData.price).toLocaleString()}`;
    }
    const fullProduct = {
      ...newProductData,
      id,
      createdAt: new Date().toISOString()
    };

    this.products.unshift(fullProduct);
    this.saveToFile();

    if (this.isMongoActive) {
      try {
        await Product.create(fullProduct);
      } catch (e) {
        console.warn('MongoDB product insert fallback', e.message);
      }
    }

    return fullProduct;
  }

  async updateProduct(id, updateData) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    if (updateData.price && !updateData.formattedPrice) {
      updateData.formattedPrice = `GH₵ ${Number(updateData.price).toLocaleString()}`;
    }

    this.products[index] = {
      ...this.products[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.saveToFile();

    if (this.isMongoActive) {
      try {
        await Product.findOneAndUpdate({ id }, updateData, { new: true });
      } catch (e) {}
    }

    return this.products[index];
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    this.saveToFile();

    if (this.isMongoActive) {
      try {
        await Product.findOneAndDelete({ id });
      } catch (e) {}
    }

    return true;
  }

  // ==================== ORDERS ====================
  async getAllOrders() {
    if (this.isMongoActive) {
      try {
        const dbOrders = await Order.find({}).sort({ createdAt: -1 }).lean();
        if (dbOrders && dbOrders.length > 0) return dbOrders;
      } catch (e) {}
    }
    return this.orders;
  }

  async getOrderByRef(reference) {
    const raw = (reference || '').trim();
    if (!raw) return null;
    const cleanRef = raw.toUpperCase();

    if (this.isMongoActive) {
      try {
        const order = await Order.findOne({
          $or: [
            { reference: { $regex: new RegExp(`^${cleanRef}$`, 'i') } },
            { customerEmail: { $regex: new RegExp(`^${raw}$`, 'i') } },
            { trackingNumber: { $regex: new RegExp(`^${cleanRef}$`, 'i') } }
          ]
        }).sort({ createdAt: -1 }).lean();
        if (order) return order;
      } catch (e) {}
    }

    return this.orders.find(o => 
      (o.reference || '').toUpperCase() === cleanRef ||
      (o.customerEmail || '').toLowerCase() === raw.toLowerCase() ||
      (o.trackingNumber || '').toUpperCase() === cleanRef
    ) || null;
  }

  async saveOrder(orderData) {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      status: orderData.status || 'pending'
    };

    // Check if order already exists in memory
    const existingIndex = this.orders.findIndex(o => o.reference === orderData.reference);
    if (existingIndex >= 0) {
      this.orders[existingIndex] = { ...this.orders[existingIndex], ...orderWithTimestamp };
    } else {
      this.orders.unshift(orderWithTimestamp);
    }
    this.saveToFile();

    if (this.isMongoActive) {
      try {
        await Order.findOneAndUpdate(
          { reference: orderData.reference },
          orderWithTimestamp,
          { upsert: true, new: true }
        );
      } catch (e) {
        console.warn('MongoDB order persistence fallback', e.message);
      }
    }

    return orderWithTimestamp;
  }

  async updateOrderStatus(reference, status, trackingNumber = null) {
    const order = await this.getOrderByRef(reference);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    const index = this.orders.findIndex(o => o.reference === order.reference);
    if (index >= 0) {
      this.orders[index] = order;
      this.saveToFile();
    }

    if (this.isMongoActive) {
      try {
        await Order.findOneAndUpdate(
          { reference: order.reference },
          { status, trackingNumber: trackingNumber || order.trackingNumber, updatedAt: new Date() }
        );
      } catch (e) {}
    }

    return order;
  }

  // ==================== INQUIRIES ====================
  async getAllInquiries() {
    return this.inquiries;
  }

  async saveInquiry(inquiryData) {
    const inquiry = {
      id: 'inq-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      reference: inquiryData.reference || ('INQ-GH-' + Math.floor(1000 + Math.random() * 9000)),
      name: inquiryData.name || '',
      email: inquiryData.email || '',
      phone: inquiryData.phone || '',
      subject: inquiryData.subject || 'General Inquiry',
      channel: inquiryData.channel || 'Direct Web',
      notes: inquiryData.notes || '',
      status: inquiryData.status || 'new',
      createdAt: new Date().toISOString()
    };
    this.inquiries.unshift(inquiry);
    this.saveToFile();
    return inquiry;
  }

  async updateInquiryStatus(id, status) {
    const inq = this.inquiries.find(i => i.id === id || i.reference === id);
    if (!inq) return null;
    inq.status = status;
    inq.updatedAt = new Date().toISOString();
    this.saveToFile();
    return inq;
  }
}

export const dbStore = new ResilientDataStore();

