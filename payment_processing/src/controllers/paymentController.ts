import amqp, { Connection, Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import Payment from '../models/paymentModel';
import serverConfig from '../config/server-config';
import _enum from '../utils/enum';

let connection: Connection | null = null;
let channel: amqp.Channel

const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        console.log('Connected to RabbitMQ');

        channel = await connection.createChannel();
        await channel.assertQueue(_enum.ORDER_CREATED);
        await channel.assertQueue(_enum.PAYMENT_STATUS);

        console.log('Waiting for messages in order.created queue');

        channel.consume(_enum.ORDER_CREATED, async (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log('Received order:', order);

                try {
                    await processPayment(order);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Payment processing error:', err);

                }
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

const processPayment = async (order: any,): Promise<void> => {
    const paymentId = uuidv4();
    const isSuccess = mockPaymentProcessing();

    const paymentStatus = isSuccess ? _enum.SUCCESS : _enum.FAILURE


    try {

        const payment = new Payment({
            paymentId,
            orderId: order.orderId,
            userId: order.userId,
            amount: order.totalPrice,
            status: paymentStatus
        });
        await payment.save();


        if (channel) {
            channel.sendToQueue(_enum.PAYMENT_STATUS,
                Buffer.from(JSON.stringify({
                    paymentId,
                    orderId: order.orderId,
                    status: paymentStatus
                })));
        } else {
            console.error('RabbitMQ channel not initialized');
        }
    } catch (err) {
        console.error('Error processing payment:', err);
    }
};

const mockPaymentProcessing = (): boolean => {

    return Math.random() < 0.8;
};

export { connectRabbitMQ };
