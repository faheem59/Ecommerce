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
exports.connectRabbitMQ = exports.channel = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const enum_1 = __importDefault(require("../utils/enum"));
const message_1 = __importDefault(require("../utils/message"));
const server_config_1 = __importDefault(require("./server-config"));
let connection;
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        connection = yield amqplib_1.default.connect(server_config_1.default.RABBITMQ_URI);
        exports.channel = yield connection.createChannel();
        yield exports.channel.assertQueue(enum_1.default.USER_CREATED);
        yield exports.channel.assertQueue(enum_1.default.USER_LOGIN);
        console.log('Connected to RabbitMQ');
    }
    catch (error) {
        console.error(message_1.default.CONNECTION_ERROR, error);
    }
});
exports.connectRabbitMQ = connectRabbitMQ;
