// src/routes/paymentRoutes.ts

import express from 'express';
import { processPayment, } from '../controllers/paymentController';
import authMiddleware from '../middleware/auth';


const router = express.Router();

router.post('/process-payment', authMiddleware, processPayment);
// router.get('/verify-payment/:paymentId', verifyPayment);

export default router;
