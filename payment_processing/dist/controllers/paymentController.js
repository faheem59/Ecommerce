"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeOrderCreated = exports.connectRabbitMQ = void 0;
const amqplib_1 = require("amqplib");
const uuid_1 = require("uuid");
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const redis_1 = __importDefault(require("../config/redis"));
const server_config_1 = __importDefault(require("../config/server-config"));
let channel;
let connection = null;
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        connection = yield (0, amqplib_1.connect)(server_config_1.default.RABBITMQ_URI);
        channel = yield connection.createChannel();
        yield channel.assertQueue('order.created');
        yield channel.assertQueue('payment.processed');
        console.log('Connected to RabbitMQ');
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
});
exports.connectRabbitMQ = connectRabbitMQ;
const processPayment = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = (0, uuid_1.v4)();
    const payment = new paymentModel_1.default({
        paymentId,
        orderId: order.orderId,
        amount: order.price,
        status: 'processed',
    });
    yield payment.save();
    redis_1.default.setEx(order.orderId, 3600, JSON.stringify(payment));
    if (channel) {
        yield channel.sendToQueue('payment.processed', Buffer.from(JSON.stringify(payment)));
    }
    else {
        console.error('RabbitMQ channel is not available.');
    }
});
const consumeOrderCreated = () => __awaiter(void 0, void 0, void 0, function* () {
    if (channel) {
        channel.consume('order.created', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log('Processing payment for Order ID:', order.orderId);
                yield processPayment(order);
                channel.ack(msg);
            }
        }));
    }
    else {
        console.error('RabbitMQ channel is not available.');
    }
});
exports.consumeOrderCreated = consumeOrderCreated;
