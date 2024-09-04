"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const http_status_1 = __importDefault(require("http-status"));
const getHealthStatus = (req, res) => {
    res.status(http_status_1.default.OK).json({
        status: 'ok',
        timestamp: new Date()
    });
};
exports.getHealthStatus = getHealthStatus;
