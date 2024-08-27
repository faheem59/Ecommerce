import amqp, { Connection, Channel } from 'amqplib';
import serverConfig from '../config/server-config';
import _enum from '../utils/enum';

let connection: Connection | null = null;
let channel: Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        console.log('Connected to RabbitMQ');

        channel = await connection.createChannel();
        await channel.assertQueue(_enum.PAYMENT_STATUS);

        console.log('RabbitMQ setup complete');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

export { connectRabbitMQ, channel };
