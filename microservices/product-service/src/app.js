const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'product-service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/products/health',
      getAllProducts: 'GET /api/products',
      getProduct: 'GET /api/products/:id',
      searchProducts: 'GET /api/products/search?q=query',
      getCategories: 'GET /api/products/categories',
      getByCategory: 'GET /api/products/category/:category',
      createProduct: 'POST /api/products',
      updateProduct: 'PUT /api/products/:id',
      updateStock: 'PATCH /api/products/:id/stock',
      deleteProduct: 'DELETE /api/products/:id'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
