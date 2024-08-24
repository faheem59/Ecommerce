import amqp from 'amqplib';
import Order from '../models/orderModel';
import serverConfig from '../config/server-config';
import _enum from '../utils/enum';

let connection: amqp.Connection
let channel: amqp.Channel;

const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        console.log('Connected to RabbitMQ');

        channel = await connection.createChannel();
        await channel.assertQueue(_enum.PAYMENT_STATUS);
        await channel.assertQueue(_enum.FULFILMENT_STATUS);

        console.log('Waiting for messages in payment.status queue');

        channel.consume(_enum.PAYMENT_STATUS, async (msg) => {
            if (msg !== null) {
                const paymentStatus = JSON.parse(msg.content.toString());
                console.log('Received payment status:', paymentStatus);

                try {
                    await handleFulfillment(paymentStatus);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Fulfillment error:', err);
                }
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

const handleFulfillment = async (paymentStatus: any): Promise<void> => {
    const { paymentId, orderId, status } = paymentStatus;
    const fulfillmentStatus = status === _enum.SUCCESS ? _enum.FULFILLED : _enum.FAILED;
    try {
        const order = await Order.findOne({ orderId });
        if (!order) {
            console.error('Order not found:', orderId);
            return;
        }

        order.status = fulfillmentStatus;
        await order.save();
        if (channel) {
            channel.sendToQueue(_enum.FULFILMENT_STATUS,
                Buffer.from(JSON.stringify({
                    paymentId,
                    orderId,
                    status: fulfillmentStatus
                })));
        } else {
            console.error('RabbitMQ channel not initialized');
        }

        console.log(`Order ${orderId} has been ${fulfillmentStatus}`);
    } catch (err) {
        console.error('Error handling fulfillment:', err);
    }
};

export { connectRabbitMQ };
