const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Health check
router.get('/health', paymentController.healthCheck);

// Get payment statistics (admin)
router.get('/statistics', paymentController.getStatistics);

// Get all payments (admin)
router.get('/all', paymentController.getAllPayments);

// Get user's payment history
router.get('/user/:userId', paymentController.getUserPayments);

// Get payment by order ID
router.get('/order/:orderId', paymentController.getPaymentByOrderId);

// Get payment by ID
router.get('/:paymentId', paymentController.getPaymentById);

// Process payment
router.post('/process', paymentController.processPayment);

// Process refund
router.post('/refund', paymentController.processRefund);

module.exports = router;
