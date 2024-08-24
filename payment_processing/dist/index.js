"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const paymentController_1 = require("./controllers/paymentController");
const server_config_1 = __importDefault(require("./config/server-config"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
// Connect to RabbitMQ
(0, paymentController_1.connectRabbitMQ)();
app.use('/api', paymentRoutes_1.default);
const PORT = server_config_1.default.PORT;
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
