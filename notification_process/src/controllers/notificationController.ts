// import amqp from 'amqplib';
// import nodemailer from 'nodemailer';
// import _enum from '../utils/enum';
// import serverConfig from '../config/server-config';
// import { getUserDetails } from '../utils/apiData';

// let connection: amqp.Connection;
// let channel: amqp.Channel;

// const connectRabbitMQ = async (): Promise<void> => {
//   try {
//     connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
//     channel = await connection.createChannel();
//     console.log('Connected to RabbitMQ and listening for messages');

//     await consumeQueue(_enum.USER_CREATED);
//     await consumeQueue(_enum.ORDER_CREATED);
//     await consumeQueue(_enum.PAYMENT_STATUS);
//     await consumeQueue(_enum.FULFILMENT_STATUS);

//   } catch (error) {
//     console.error(error);
//   }
// };

// const consumeQueue = (queue: string): void => {
//   channel.consume(queue, async (msg) => {
//     if (msg !== null) {
//       const messageContent = JSON.parse(msg.content.toString());
//       console.log(`Received ${queue} message:`, messageContent);

//       const userId = messageContent.userId;

//       try {
//         await processMessage(messageContent, queue, userId);
//         channel.ack(msg);
//       } catch (err) {
//         console.error(`Error processing ${queue} message:`, err);
//       }
//     }
//   });
// };

// const processMessage = async (message: any, queue: string, userId: string): Promise<void> => {
//   const subjectAndText = getSubjectAndText(message, queue);

//   if (!subjectAndText) {
//     console.error(`No subject and text defined for queue ${queue}`);
//     return;
//   }

//   const { subject, text } = subjectAndText;

//   try {
//     const userDetails = await getUserDetails(userId);

//     if (!userDetails || !userDetails.email) {
//       console.error('User details not found or email missing');
//       return;
//     }

//     await sendEmail(userDetails.email, subject, text);
//   } catch (error) {
//     console.error(`Error processing message for ${queue}:`, error);
//   }
// };

// const getSubjectAndText = (message: any, queue: string) => {


//   switch (queue) {
//     case _enum.USER_CREATED:
//       return {
//         subject: _enum.USERCREATED,
//         text: `Hello ${message.username}, your user ${message.userId} has been created.`,
//       };
//     case _enum.ORDER_CREATED:
//       return {
//         subject: _enum.ORDERCREATED,
//         text: `Hello ${message.username}, your order ${message.orderId} has been created.`,
//       };
//     case _enum.PAYMENT_STATUS:
//       return {
//         subject: _enum.PAYMENTSTATUS,
//         text: `Hello, ${message.username} payment ${message.paymentId} for order ${message.orderId} is ${message.status}.`,
//       };
//     case _enum.FULFILMENT_STATUS:
//       return {
//         subject: _enum.FULFILMENTSTATUS,
//         text: `Hello,${message.username} your order ${message.orderId} has been ${message.status}.`,
//       };
//     default:
//       console.error(`Unknown queue: ${queue}`);
//       return null;
//   }
// };

// const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: serverConfig.MAIL,
//       pass: serverConfig.PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({ from: serverConfig.MAIL, to, subject, text });
//     console.log(`Email sent to ${to} with subject "${subject}"`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// export { connectRabbitMQ };


import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import _enum from '../utils/enum';
import serverConfig from '../config/server-config';
import { getUserDetails } from '../utils/apiData';

let connection: amqp.Connection;
let channel: amqp.Channel;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(serverConfig.RABBITMQ_URI as string);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ and listening for messages');

    await consumeQueue(_enum.USER_CREATED);
    await consumeQueue(_enum.ORDER_CREATED);
    await consumeQueue(_enum.PAYMENT_STATUS);
    await consumeQueue(_enum.FULFILMENT_STATUS);

  } catch (error) {
    console.error(error);
  }
};

const consumeQueue = (queue: string): void => {
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const messageContent = JSON.parse(msg.content.toString());
      console.log(`Received ${queue} message:`, messageContent);

      const userId = messageContent.userId;

      try {
        await processMessage(messageContent, queue, userId);
        channel.ack(msg);
      } catch (err) {
        console.error(`Error processing ${queue} message:`, err);
      }
    }
  });
};

const processMessage = async (message: any, queue: string, userId: string): Promise<void> => {
  const subjectAndText = await getSubjectAndText(message, queue, userId);

  if (!subjectAndText) {
    console.error(`No subject and text defined for queue ${queue}`);
    return;
  }

  const { subject, text } = subjectAndText;

  try {
    const userDetails = await getUserDetails(userId);

    if (!userDetails || !userDetails.email || !userDetails.username) {
      console.error('User details not found, email or username missing');
      return;
    }

    await sendEmail(userDetails.email, subject, text.replace('{{username}}', userDetails.username));
  } catch (error) {
    console.error(`Error processing message for ${queue}:`, error);
  }
};

const getSubjectAndText = async (message: any, queue: string, userId: string) => {
  // Placeholder text with {{username}} to be replaced
  const userDetails = await getUserDetails(userId);

  if (!userDetails || !userDetails.username) {
    console.error('User details not found for subject and text creation');
    return null;
  }

  switch (queue) {
    case _enum.USER_CREATED:
      return {
        subject: `Welcome ${userDetails.username}!`,
        text: `Dear ${userDetails.username},\n\nYour account with ID ${message.userId} has been successfully created.\n\nThank you for joining us!\n\nBest regards,\nThe Team`,
      };
    case _enum.ORDER_CREATED:
      return {
        subject: `Order Confirmation ${message.orderId}`,
        text: `Dear ${userDetails.username},\n\nYour order with ID ${message.orderId} has been successfully created.\n\nThank you for your purchase!\n\nBest regards,\nThe Team`,
      };
    case _enum.PAYMENT_STATUS:
      return {
        subject: `Payment Status Update for Order ${message.orderId}`,
        text: `Dear ${userDetails.username},\n\nThe payment with ID ${message.paymentId} for your order ${message.orderId} is currently ${message.status}.\n\nThank you!\n\nBest regards,\nThe Team`,
      };
    case _enum.FULFILMENT_STATUS:
      return {
        subject: `Order ${message.orderId} Fulfilment Status`,
        text: `Dear ${userDetails.username},\n\nYour order ${message.orderId} is now ${message.status}.\n\nThank you for shopping with us!\n\nBest regards,\nThe Team`,
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

