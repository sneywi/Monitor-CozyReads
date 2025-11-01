const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Health check
router.get('/health', orderController.healthCheck);

// Get order statistics (admin)
router.get('/statistics', orderController.getStatistics);

// Get all orders (admin)
router.get('/all', orderController.getAllOrders);

// Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// Get single order
router.get('/:orderId', orderController.getOrderById);

// Create order
router.post('/create', orderController.createOrder);

// Update order status
router.put('/:orderId/status', orderController.updateOrderStatus);

// Cancel order
router.put('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;
