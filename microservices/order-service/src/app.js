const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

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
app.use('/api/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'order-service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/orders/health',
      createOrder: 'POST /api/orders/create',
      getOrder: 'GET /api/orders/:orderId',
      getUserOrders: 'GET /api/orders/user/:userId',
      getAllOrders: 'GET /api/orders/all',
      updateStatus: 'PUT /api/orders/:orderId/status',
      cancelOrder: 'PUT /api/orders/:orderId/cancel',
      statistics: 'GET /api/orders/statistics'
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
