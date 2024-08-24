import amqp, { Connection, Channel } from 'amqplib';
import message from '../utils/message';
import serverConfig from './server-config';
import _enum from '../utils/enum';

let connection: amqp.Connection
export let channel: amqp.Channel

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        channel = await connection.createChannel();
        await channel.assertQueue(_enum.ORDER_CREATED);
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error(message.CONNECTION_ERROR, error);
    }
};


