import { Router } from 'express';
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart
} from '../controllers/cartController.js';
import {
  validateAddItem,
  validateUpdateQuantity
} from '../middlewares/validation.js';

const router = Router();

// Routes prefix: /api/cart
router.get('/', getCart);
router.post('/items', validateAddItem, addItem);
router.patch('/items/:name', validateUpdateQuantity, updateQuantity);
router.delete('/items/:name', removeItem);
router.delete('/', clearCart);

export default router;
