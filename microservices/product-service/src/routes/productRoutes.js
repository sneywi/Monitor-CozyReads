const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Health check
router.get('/health', productController.healthCheck);

// Health check for product-service 
router.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'product-service' });
});

// Get all categories
router.get('/categories', productController.getCategories);

// Search products
router.get('/search', productController.searchProducts);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get all products (with optional filters)
router.get('/', productController.getAllProducts);

// Get single product
router.get('/:id', productController.getProductById);

// Create product (admin - no auth for Phase 1)
router.post('/', productController.createProduct);

// Update product (admin)
router.put('/:id', productController.updateProduct);

// Update stock
router.patch('/:id/stock', productController.updateStock);

// Delete product (admin)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
