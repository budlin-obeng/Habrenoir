import express from 'express';
import {
  initializeCheckout,
  verifyPayment,
  handleWebhook,
  getOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/checkoutController.js';
import { checkoutLimiter } from '../middleware/rateLimiter.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer Checkout & Verification (Rate-limited to prevent checkout brute-force)
router.post('/initialize', checkoutLimiter, initializeCheckout);
router.get('/verify/:reference', verifyPayment);
router.post('/webhook', handleWebhook);

// Orders endpoints (State mutation restricted to authenticated administrators)
router.get('/orders', getOrders);
router.get('/orders/:reference', getOrderDetails);
router.put('/orders/:reference/status', requireAdmin, updateOrderStatus);

export default router;
