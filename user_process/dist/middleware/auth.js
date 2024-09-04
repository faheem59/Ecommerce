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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../config/redis"));
const message_1 = __importDefault(require("../utils/message"));
const server_config_1 = __importDefault(require("../config/server-config"));
const http_status_1 = __importDefault(require("http-status"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(http_status_1.default.UNAUTHORIZED).json({ message: message_1.default.TOKEN_NOT_FOUND });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, server_config_1.default.JWT_SECRET);
        const redisToken = yield redis_1.default.get(`auth_token_${decoded.userId}`);
        if (redisToken === token) {
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(http_status_1.default.UNAUTHORIZED).json({ message: message_1.default.INVALID_TOKEN });
        }
    }
    catch (error) {
        res.status(http_status_1.default.UNAUTHORIZED).json({ message: message_1.default.UNAUHTORIZED });
    }
});
exports.default = authMiddleware;
