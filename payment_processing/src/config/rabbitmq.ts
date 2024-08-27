import { Request, Response } from 'express';
import amqp from 'amqplib';
import serverConfig from '../config/server-config';
import _enum from '../utils/enum';
import { processPayment } from '../controllers/paymentController';

let connection: amqp.Connection;
let channel: amqp.Channel;

const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        console.log('Connected to RabbitMQ');

        channel = await connection.createChannel();
        await channel.assertQueue(_enum.ORDER_CREATED);
        await channel.assertQueue(_enum.PAYMENT_STATUS);

        channel.consume(_enum.ORDER_CREATED, async (msg) => {
            if (msg !== null) {
                const { orderId, paymentMethodId } = JSON.parse(msg.content.toString());
                console.log('Received order:', { orderId, paymentMethodId });

                try {
                    const req = {
                        body: { orderId, paymentMethodId }
                    } as Request;

                    const res = {
                        status: (statusCode: number) => ({
                            json: (responseBody: any) => console.log('Response:', statusCode, responseBody)
                        })
                    } as Response;

                    await processPayment(req, res);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Payment processing error:', err);
                    channel.nack(msg, false, true);
                }
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

export { connectRabbitMQ, channel };
