// import amqp, { Connection, Channel } from 'amqplib';
// import { v4 as uuidv4 } from 'uuid';
// import Payment from '../models/paymentModel';
// import serverConfig from '../config/server-config';
// import _enum from '../utils/enum';

// let connection: Connection | null = null;
// let channel: amqp.Channel

// const connectRabbitMQ = async (): Promise<void> => {
//     try {
//         connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
//         console.log('Connected to RabbitMQ');

//         channel = await connection.createChannel();
//         await channel.assertQueue(_enum.ORDER_CREATED);
//         await channel.assertQueue(_enum.PAYMENT_STATUS);

//         console.log('Waiting for messages in order.created queue');

//         channel.consume(_enum.ORDER_CREATED, async (msg) => {
//             if (msg !== null) {
//                 const order = JSON.parse(msg.content.toString());
//                 console.log('Received order:', order);

//                 try {
//                     await processPayment(order);
//                     channel.ack(msg);
//                 } catch (err) {
//                     console.error('Payment processing error:', err);

//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Failed to connect to RabbitMQ:', error);
//     }
// };

// const processPayment = async (order: any,): Promise<void> => {
//     const paymentId = uuidv4();
//     const isSuccess = mockPaymentProcessing();

//     const paymentStatus = isSuccess ? _enum.SUCCESS : _enum.FAILURE


//     try {

//         const payment = new Payment({
//             paymentId,
//             orderId: order.orderId,
//             userId: order.userId,
//             amount: order.totalPrice,
//             status: paymentStatus
//         });
//         await payment.save();


//         if (channel) {
//             channel.sendToQueue(_enum.PAYMENT_STATUS,
//                 Buffer.from(JSON.stringify({
//                     paymentId,
//                     orderId: order.orderId,
//                     status: paymentStatus
//                 })));
//         } else {
//             console.error('RabbitMQ channel not initialized');
//         }
//     } catch (err) {
//         console.error('Error processing payment:', err);
//     }
// };

// const mockPaymentProcessing = (): boolean => {

//     return Math.random() < 0.8;
// };

// export { connectRabbitMQ };




// import { Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import Payment from '../models/paymentModel';
// import redisClient from '../config/redis';
// import { channel } from '../config/rabbitmq';
// import _enum from '../utils/enum';

// export const processPayment = async (req: Request, res: Response): Promise<void> => {
//     const { orderId } = req.body;


//     if (!orderId) {
//         res.status(400).json({ message: 'Order ID is required' });
//         return;
//     }

//     try {
//         const orderData = await redisClient.get(orderId);

//         if (!orderData) {
//             res.status(404).json({ message: 'Order not found' });
//             return;
//         }

//         const order = JSON.parse(orderData);
//         const { userId, totalPrice } = order;

//         const paymentId = uuidv4();
//         const isSuccess = mockPaymentProcessing();
//         const paymentStatus = isSuccess ? _enum.SUCCESS : _enum.FAILURE;

//         const payment = new Payment({
//             paymentId,
//             orderId,
//             userId,
//             amount: totalPrice,
//             status: paymentStatus
//         });
//         await payment.save();

//         if (channel) {
//             channel.sendToQueue(_enum.PAYMENT_STATUS, Buffer.from(JSON.stringify({
//                 paymentId,
//                 orderId,
//                 userId,
//                 status: paymentStatus
//             })));
//         } else {
//             console.error('RabbitMQ channel not initialized');
//         }

//         res.status(200).json({ paymentId, status: paymentStatus });

//     } catch (error) {
//         console.error('Error processing payment:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
//     const { paymentId } = req.params;

//     if (!paymentId) {
//         res.status(400).json({ message: 'Payment ID is required' });
//         return;
//     }

//     try {
//         const payment = await Payment.findOne({ paymentId });

//         if (payment) {
//             res.status(200).json({ payment });
//         } else {
//             res.status(404).json({ message: 'Payment not found' });
//         }
//     } catch (error) {
//         console.error('Error verifying payment:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const mockPaymentProcessing = (): boolean => {
//     return Math.random() < 0.8;
// };


// Using Stripe

import { Request, Response } from 'express';
import Payment from '../models/paymentModel';
import redisClient from '../config/redis';
import { channel } from '../config/rabbitmq';
import _enum from '../utils/enum';
import { createPaymentIntent, confirmPaymentIntent } from '../services/stripeServices';


export const processPayment = async (req: Request, res: Response): Promise<void> => {

    const { orderId, paymentMethodId } = req.body;

    if (!orderId || !paymentMethodId) {
        res.status(400).json({ message: 'Order ID and Payment Method ID are required' });
        return;
    }

    try {
        const orderData = await redisClient.get(orderId);

        if (!orderData) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const order = JSON.parse(orderData);
        const { userId, totalPrice } = order;


        const paymentIntent = await createPaymentIntent(totalPrice * 100);


        const confirmedPaymentIntent = await confirmPaymentIntent(paymentIntent.id, paymentMethodId);

        const paymentStatus = confirmedPaymentIntent.status === _enum.SUCCEEDED ? _enum.SUCCESS : _enum.FAILURE;

        const payment = new Payment({
            paymentId: paymentIntent.id,
            orderId,
            userId,
            amount: totalPrice,
            status: paymentStatus
        });

        await payment.save();

        if (channel) {
            channel.sendToQueue(_enum.PAYMENT_STATUS, Buffer.from(JSON.stringify({
                paymentId: paymentIntent.id,
                orderId,
                userId,
                status: paymentStatus
            })));
        } else {
            console.error('RabbitMQ channel not initialized');
        }

        res.status(200).json({ paymentId: paymentIntent.id, status: paymentStatus });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
