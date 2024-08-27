const express = require('express');
const { consumeOrderFulfilled, consumePaymentProcessed } = require('../controllers/notificationController');

const router = express.Router();

consumeOrderFulfilled();
consumePaymentProcessed();

module.exports = router;
