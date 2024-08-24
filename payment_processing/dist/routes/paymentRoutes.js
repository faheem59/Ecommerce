"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.get('/ful', paymentController_1.consumeOrderCreated);
(0, paymentController_1.consumeOrderCreated)();
exports.default = router;
