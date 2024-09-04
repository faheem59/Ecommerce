"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const rabbitmq_1 = require("./config/rabbitmq");
const server_config_1 = __importDefault(require("./config/server-config"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const healthCheckRoutes_1 = __importDefault(require("./routes/healthCheckRoutes"));
const cors_1 = __importDefault(require("cors"));
const enum_1 = __importDefault(require("./utils/enum"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
(0, rabbitmq_1.connectRabbitMQ)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(enum_1.default.URLS, userRoutes_1.default);
app.use('/', healthCheckRoutes_1.default);
const PORT = server_config_1.default.PORT;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
