const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
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
app.use('/api/cart', cartRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'cart-service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/cart/health',
      getCart: 'GET /api/cart/:userId',
      addToCart: 'POST /api/cart/add',
      updateCart: 'PUT /api/cart/update',
      removeItem: 'DELETE /api/cart/remove/:userId/:productId',
      clearCart: 'DELETE /api/cart/clear/:userId'
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
