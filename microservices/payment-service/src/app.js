const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`([${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/payments', paymentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'payment-service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/payments/health',
      processPayment: 'POST /api/payments/process',
      getPayment: 'GET /api/payments/:paymentId',
      getPaymentByOrder: 'GET /api/payments/order/:orderId',
      getUserPayments: 'GET /api/payments/user/:userId',
      getAllPayments: 'GET /api/payments/all',
      processRefund: 'POST /api/payments/refund',
      statistics: 'GET /api/payments/statistics'
    },
    supportedMethods: ['credit_card', 'debit_card', 'paypal', 'upi']
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
