// import amqp from 'amqplib';
// import nodemailer from 'nodemailer';

// // Environment Variables
// const EMAIL_USER = process.env.MAIL as string;
// const EMAIL_PASS = process.env.PASS as string;
// const RABBITMQ_URI = process.env.RABBITMQ_URI as string;

// let connection: amqp.Connection;
// let channel: amqp.Channel;

// // Connect to RabbitMQ and set up consumers
// const connectRabbitMQ = async (): Promise<void> => {
//   try {
//     connection = await amqp.connect(RABBITMQ_URI);
//     channel = await connection.createChannel();

//     // Assert queues
//     await channel.assertQueue('user.created');
//     await channel.assertQueue('order.created');
//     await channel.assertQueue('payment.status');
//     await channel.assertQueue('fulfillment.status');

//     console.log('Connected to RabbitMQ and listening for messages');

//     // Set up consumers
//     await consumeQueue('user.created', processUserMessage);
//     await consumeQueue('order.created', processOrderMessage);
//     await consumeQueue('payment.status', processPaymentMessage);
//     await consumeQueue('fulfillment.status', processFulfillmentMessage);

//   } catch (error) {
//     console.error(error);
//   }
// };

// // Function to set up a queue consumer
// const consumeQueue = async (queue: string, processor: (message: any) => Promise<void>): Promise<void> => {
//   channel.consume(queue, async (msg) => {
//     if (msg !== null) {
//       const messageContent = JSON.parse(msg.content.toString());
//       console.log(`Received ${queue} message:`, messageContent);

//       try {
//         await processor(messageContent);
//         channel.ack(msg);
//       } catch (err) {
//         console.error(`Error processing ${queue} message:`, err);
//         // Optionally, you can use channel.nack(msg) to requeue the message
//       }
//     }
//   });
// };

// const processUserMessage = async (message: { userId: string; email: string }): Promise<void> => {
//   const { userId, email } = message;
//   const subject = 'User Created';
//   const text = `Hello ${email}, your user ${userId} has been created.`;

//   try {
//     await sendEmail(email, subject, text);
//   } catch (error) {
//     console.error('Error sending email for user creation:', error);
//   }
// }

// const processOrderMessage = async (message: { userId: string; orderId: string, email: string }): Promise<void> => {
//   const { userId, orderId, email } = message;
//   const subject = 'Order Created';
//   const text = `Hello ${userId}, your order ${orderId} has been created.`;

//   try {
//     await sendEmail(email, subject, text);
//   } catch (error) {
//     console.error('Error sending email for order creation:', error);
//   }
// };

// // Process payment status messages
// const processPaymentMessage = async (message: { userId: string; email: string; paymentId: string; orderId: string; status: string }): Promise<void> => {
//   const { userId, email, paymentId, orderId, status } = message;
//   const subject = 'Payment Status Update';
//   const text = `Hello, payment ${paymentId} for order ${orderId} is ${status}.`;

//   try {
//     await sendEmail(email, subject, text);
//   } catch (error) {
//     console.error('Error sending email for payment status:', error);
//   }
// };

// // Process fulfillment status messages
// const processFulfillmentMessage = async (message: { userId: string; email: string; orderId: string; status: string }): Promise<void> => {
//   const { userId, email, orderId, status } = message;
//   const subject = 'Order Fulfillment Status';
//   const text = `Hello, your order ${orderId} has been ${status}.`;

//   try {
//     await sendEmail(email, subject, text);
//   } catch (error) {
//     console.error('Error sending email for fulfillment status:', error);
//   }
// };

// // Function to send email using nodemailer
// const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: EMAIL_USER,
//       pass: EMAIL_PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({ from: EMAIL_USER, to, subject, text });
//     console.log(`Email sent to ${to} with subject "${subject}"`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// // Export the connectRabbitMQ function
// export { connectRabbitMQ };

import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import _enum from '../utils/enum';
import serverConfig from '../config/server-config';

let connection: amqp.Connection;
let channel: amqp.Channel;
let senderEmail: string | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
    channel = await connection.createChannel();

    await channel.assertQueue(_enum.USER_CREATED);
    await channel.assertQueue(_enum.ORDER_CREATED);
    await channel.assertQueue(_enum.PAYMENT_STATUS);
    await channel.assertQueue(_enum.FULFILMENT_STATUS);

    console.log('Connected to RabbitMQ and listening for messages');

    await consumeQueue(_enum.USER_CREATED);
    await consumeQueue(_enum.ORDER_CREATED);
    await consumeQueue(_enum.PAYMENT_STATUS);
    await consumeQueue(_enum.FULFILMENT_STATUS);

  } catch (error) {
    console.error(error);
  }
};

const consumeQueue = async (queue: string): Promise<void> => {
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const messageContent = JSON.parse(msg.content.toString());
      console.log(`Received ${queue} message:`, messageContent);

      try {
        await processMessage(messageContent, queue);
        channel.ack(msg);
      } catch (err) {
        console.error(`Error processing ${queue} message:`, err);
      }
    }
  });
};

const processMessage = async (message: any, queue: string): Promise<void> => {
  if (queue === _enum.USER_CREATED) {
    senderEmail = message.email;
  }

  const subjectAndText = getSubjectAndText(message, queue);

  if (!subjectAndText) {
    console.error(`No subject and text defined for queue ${queue}`);
    return;
  }

  const { subject, text } = subjectAndText;

  if (senderEmail) {
    try {
      await sendEmail(senderEmail, subject, text);
    } catch (error) {
      console.error(`Error sending email for ${queue}:`, error);
    }
  } else {
    console.error('Sender email is not set. Cannot send email.');
  }
};

const getSubjectAndText = (message: any, queue: string) => {
  switch (queue) {
    case _enum.USER_CREATED:
      return {
        subject: _enum.USERCREATED,
        text: `Hello ${message.email}, your user ${message.userId} has been created.`,
      };
    case _enum.ORDER_CREATED:
      return {
        subject: _enum.ORDERCREATED,
        text: `Hello ${message.userId}, your order ${message.orderId} has been created.`,
      };
    case _enum.PAYMENT_STATUS:
      return {
        subject: _enum.PAYMENTSTATUS,
        text: `Hello, payment ${message.paymentId} for order ${message.orderId} is ${message.status}.`,
      };
    case _enum.FULFILMENT_STATUS:
      return {
        subject: _enum.FULFILMENTSTATUS,
        text: `Hello, your order ${message.orderId} has been ${message.status}.`,
      };
    default:
      console.error(`Unknown queue: ${queue}`);
      return null;
  }
};

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: serverConfig.MAIL,
      pass: serverConfig.PASS,
    },
  });

  try {
    await transporter.sendMail({ from: serverConfig.MAIL, to, subject, text });
    console.log(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export { connectRabbitMQ };
