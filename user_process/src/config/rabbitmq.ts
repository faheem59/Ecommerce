import amqp, { Connection, Channel } from 'amqplib';
import _enum from '../utils/enum';
import message from '../utils/message';
import serverConfig from './server-config';

let connection: amqp.Connection
export let channel: amqp.Channel

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
        channel = await connection.createChannel();
        await channel.assertQueue(_enum.USER_CREATED);
        await channel.assertQueue(_enum.USER_LOGIN);
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error(message.CONNECTION_ERROR, error);
    }
};


