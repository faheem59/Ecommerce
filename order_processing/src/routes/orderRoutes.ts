import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/orderController';
import authMiddleware from '../middleware/auth';

const router: Router = Router();

router.post('/orders', authMiddleware, createOrder);
router.get('/orders/:id', getOrder);

export default router;
