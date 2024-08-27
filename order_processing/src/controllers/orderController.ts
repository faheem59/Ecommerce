import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/orderModel';
import redisClient from '../config/redis';
import httpStatus from 'http-status';
import messages from '../utils/message';
import { channel } from '../config/rabbitmq';
import message from '../utils/message';
import _enum from '../utils/enum';

const createOrder = async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    const userId = req.userId

    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(httpStatus.BAD_REQUEST).json({ message: message.ITEMS_REQUIRED });
        return;
    }

    if (!userId) {
        res.status(httpStatus.BAD_REQUEST).json({ message: message.USER_ID_REQUIRED });
        return;
    }
    const totalPrice = items.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0);

    const orderId = uuidv4();
    const order = new Order({ orderId, userId, items, totalPrice });

    try {
        await order.save();
        await redisClient.setEx(orderId, 3600, JSON.stringify(order));

        if (channel) {
            await channel.sendToQueue(_enum.ORDER_CREATED, Buffer.from(JSON.stringify(order)));
        } else {
            console.error(messages.RABBITMQ_CHANNEL_ERROR);
        }

        res.status(httpStatus.CREATED).json({ message: messages.ORDER_CREATED, orderId });


    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_SERVER_ERROR, err });
    }
};

const getOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;


    try {
        const data = await redisClient.get(id);
        console.log(data, "fdf");
        if (data) {
            res.json(JSON.parse(data));
        } else {
            const order = await Order.findOne({ orderId: id });
            if (order) {
                await redisClient.setEx(id, 3600, JSON.stringify(order));
                res.json(order);
            } else {
                res.status(httpStatus.NOT_FOUND).json({ message: messages.ORDER_NOT_FOUND });
            }
        }
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: messages.INTERNAL_SERVER_ERROR, err });
    }
};

export { createOrder, getOrder };
