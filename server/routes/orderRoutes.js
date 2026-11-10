import express from 'express';
import {
  getOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/checkoutController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order tracking / Admin listing
router.get('/', getOrders);
router.get('/:reference', getOrderDetails);

// Status update (Admin restricted)
router.put('/:reference/status', requireAdmin, updateOrderStatus);

export default router;

