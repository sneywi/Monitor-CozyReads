
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Health check
router.get('/health', cartController.healthCheck);

// Get user's cart
router.get('/:userId', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:userId/:productId', cartController.removeFromCart);

// Clear entire cart
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
