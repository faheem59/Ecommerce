// Use Stripe

import { Request, Response } from 'express';
import Payment from '../models/paymentModel';
import redisClient from '../config/redis';
import { channel } from '../config/rabbitmq';
import _enum from '../utils/enum';
import { createPaymentIntent, confirmPaymentIntent } from '../services/stripeServices';
import message from '../utils/message';
import httpStatus from 'http-status';


export const processPayment = async (req: Request, res?: Response): Promise<void> => {

    const { orderId, paymentMethodId } = req.body;

    if (!orderId || !paymentMethodId) {
        res?.status(httpStatus.BAD_REQUEST).json({ message: message.ORDER_ID_AND_PAYMENT_ID_NOT_FOUND });
        return;
    }

    try {
        const orderData = await redisClient.get(orderId);

        if (!orderData) {
            res?.status(httpStatus.NOT_FOUND).json({ message: message.ORDER_NOT_FOUND });
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

        res?.status(httpStatus.OK).json({ paymentId: paymentIntent.id, status: paymentStatus });

    } catch (error) {
        console.error('Error processing payment:', error);
        res?.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR });
    }
};
