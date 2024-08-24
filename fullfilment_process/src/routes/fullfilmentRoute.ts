// // src/routes/fulfillmentRoutes.ts

// import express from 'express';
// import { connectRabbitMQ } from '../controllers/fullfilmentController';
// import httpStatus from 'http-status';
// import message from '../utils/message';
// import authMiddleware from '../middleware/auth';

// const router = express.Router();

// router.post('/connect', authMiddleware, async (req, res) => {
//     try {
//         await connectRabbitMQ();
//         res.status(httpStatus.OK).json({ message: 'Connected to RabbitMQ' });
//     } catch (err) {
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR });
//     }
// });

// export default router;
