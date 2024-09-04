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
exports.getUserByIds = exports.getUserById = exports.logout = exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const redis_1 = __importDefault(require("../config/redis"));
const message_1 = __importDefault(require("../utils/message"));
const enum_1 = __importDefault(require("../utils/enum"));
const rabbitmq_1 = require("../config/rabbitmq");
const http_status_1 = __importDefault(require("http-status"));
const server_config_1 = __importDefault(require("../config/server-config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.ALL_FIELDS_REQUIRED });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.USER_ALREADY_EXISTS });
            return;
        }
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const user = new userModel_1.default({
            userId: (0, uuid_1.v4)(),
            username,
            email,
            password: hashedPassword
        });
        yield user.save();
        if (rabbitmq_1.channel) {
            const msg = JSON.stringify({ userId: user.userId, email: user.email });
            rabbitmq_1.channel.sendToQueue(enum_1.default.USER_CREATED, Buffer.from(msg));
            console.log('User created message sent to RabbitMQ');
        }
        res.status(http_status_1.default.CREATED).json({ message: message_1.default.USER_CREATED });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: message_1.default.INTERNAL_SERVER_ERROR, error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.ALL_FIELDS_REQUIRED });
            return;
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.INVALID_EMAIL_OR_PASSWORD });
            return;
        }
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.INVALID_EMAIL_OR_PASSWORD });
            return;
        }
        if (rabbitmq_1.channel) {
            const msg = JSON.stringify({ userId: user.userId, email: user.email });
            rabbitmq_1.channel.sendToQueue(enum_1.default.USER_LOGIN, Buffer.from(msg));
            console.log('User Login message sent to RabbitMQ');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, server_config_1.default.JWT_SECRET, { expiresIn: '1h' });
        yield redis_1.default.set(`auth_token_${user._id}`, token, { EX: 3600 });
        res.status(http_status_1.default.OK).json({ token, user });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: message_1.default.INTERNAL_SERVER_ERROR, error });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.status(http_status_1.default.OK).json({ message: message_1.default.LOGOUT_USER });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: message_1.default.INTERNAL_SERVER_ERROR, error });
    }
};
exports.logout = logout;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.USER_ID_REQUIRED });
            return;
        }
        const user = yield userModel_1.default.findOne({ userId });
        if (!user) {
            res.status(http_status_1.default.NOT_FOUND).json({ message: message_1.default.USER_NOT_FOUND });
            return;
        }
        res.status(http_status_1.default.OK).json(user);
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: message_1.default.INTERNAL_SERVER_ERROR, error });
    }
});
exports.getUserById = getUserById;
const getUserByIds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, "fffsfs");
        if (!id) {
            res.status(http_status_1.default.BAD_REQUEST).json({ message: message_1.default.USER_ID_REQUIRED });
            return;
        }
        const user = yield userModel_1.default.findById(id);
        console.log("shss", user);
        if (!user) {
            res.status(http_status_1.default.NOT_FOUND).json({ message: message_1.default.USER_NOT_FOUND });
            return;
        }
        res.status(http_status_1.default.OK).json(user);
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: message_1.default.INTERNAL_SERVER_ERROR, error });
    }
});
exports.getUserByIds = getUserByIds;
