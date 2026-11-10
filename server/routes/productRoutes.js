import express from 'express';
import {
  getProducts,
  getProductById,
  getFilterMetadata,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Catalog & Faceted Metadata (Public browsing)
router.get('/', getProducts);
router.get('/meta/filters', getFilterMetadata);
router.get('/:id', getProductById);

// Admin CRUD (Strictly protected by administrative authorization middleware)
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
