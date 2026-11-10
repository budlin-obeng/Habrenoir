import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import { dbStore } from './services/dbStore.js';
import { apiGeneralLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env so it works regardless of invocation directory
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Hardened Cross-Origin Resource Sharing (CORS) Policy
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server) or verified client origins
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access restricted to authorized Habrenoir domains.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key', 'x-paystack-signature', 'x-user-role']
}));

app.use(express.json());

// Apply rate limiting across all API endpoints
app.use('/api', apiGeneralLimiter);

// Database connection with resilience
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habrenoir';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2500
}).then(() => {
  console.log('✓ MongoDB Connected: Habrenoir Database Active');
  dbStore.setMongoStatus(true);
}).catch((err) => {
  console.warn('! Notice: MongoDB local not detected. Operating with Resilient Persistent File Store (server/data/store.json).');
  dbStore.setMongoStatus(false);
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health and Integrations Status Endpoint
app.get('/api/health', async (req, res) => {
  const products = await dbStore.getAllProducts();
  const orders = await dbStore.getAllOrders();

  res.json({
    status: 'online',
    brand: 'HABRENOIR · Accra, Ghana',
    architecture: 'Luxury Flagship Architecture',
    database: {
      type: dbStore.isMongoActive ? 'MongoDB Connected' : 'Resilient Persistent JSON Store (server/data/store.json)',
      productsCount: products.length,
      ordersCount: orders.length
    },
    integrations: {
      paystack: {
        configured: Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_SECRET_KEY !== 'sk_test_placeholder_habrenoir_luxury' && process.env.PAYSTACK_SECRET_KEY.startsWith('sk_')),
        publicKeySet: Boolean(process.env.PAYSTACK_PUBLIC_KEY)
      },
      arkesel: {
        configured: Boolean(process.env.ARKESEL_API_KEY && process.env.ARKESEL_API_KEY.trim() !== ''),
        senderId: process.env.ARKESEL_SENDER_ID || 'HABRENOIR'
      },
      clerk: {
        configured: Boolean(process.env.CLERK_PUBLISHABLE_KEY || process.env.CLERK_SECRET_KEY)
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Serve compiled client build for production (Single-Service Architecture)
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  HABRENOIR · LUXURY E-COMMERCE BACKEND API SERVER`);
  console.log(`  Architecture: Gucci European Flagship Standard`);
  console.log(`  Listening on: http://localhost:${PORT}`);
  console.log(`  Catalog API:  http://localhost:${PORT}/api/products`);
  console.log(`  Checkout API: http://localhost:${PORT}/api/checkout/initialize`);
  console.log(`  Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`======================================================\n`);
});
