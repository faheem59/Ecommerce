"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthCheckController_1 = require("../controllers/healthCheckController");
const router = (0, express_1.Router)();
router.get('/health', healthCheckController_1.getHealthStatus);
exports.default = router;
