const express = require('express');
const { consumeOrderFulfilled, consumePaymentProcessed } = require('../controllers/notificationController');

const router = express.Router();

// Start consuming order.fulfilled and payment.processed messages
consumeOrderFulfilled();
consumePaymentProcessed();

module.exports = router;
