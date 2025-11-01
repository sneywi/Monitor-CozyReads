const PaymentModel = require('../models/Payment');
const axios = require('axios');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';

// Helper: Get order from Order Service
async function getOrder(orderId) {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order:', error.message);
    return null;
  }
}

// Helper: Update order payment status
async function updateOrderPayment(orderId, paymentStatus, paymentMethod) {
  try {
    // First update the payment status in Order Service
    // This would typically be done via a dedicated endpoint
    // For now, we'll update the order status if payment is successful
    if (paymentStatus === 'completed') {
      await axios.put(`${ORDER_SERVICE_URL}/api/orders/${orderId}/status`, {
        status: 'confirmed'
      });
    }
    return true;
  } catch (error) {
    console.error('Error updating order payment:', error.message);
    return false;
  }
}

// Simulate payment gateway processing
function simulatePaymentGateway(paymentMethod, amount) {
  // Simulate 95% success rate
  const success = Math.random() < 0.95;
  
  const transactionId = success 
    ? `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    : null;

  return {
    success,
    transactionId,
    message: success ? 'Payment processed successfully' : 'Payment failed - insufficient funds or invalid details'
  };
}

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod, cardDetails, upiId, paypalEmail } = req.body;

    // Validation
    if (!orderId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, User ID, Amount, and Payment Method are required'
      });
    }

    // Validate payment method
    const validMethods = ['credit_card', 'debit_card', 'paypal', 'upi'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Valid methods: ${validMethods.join(', ')}`
      });
    }

    // Validate method-specific details
    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && !cardDetails) {
      return res.status(400).json({
        success: false,
        message: 'Card details are required for card payments'
      });
    }

    if (paymentMethod === 'upi' && !upiId) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID is required for UPI payments'
      });
    }

    if (paymentMethod === 'paypal' && !paypalEmail) {
      return res.status(400).json({
        success: false,
        message: 'PayPal email is required for PayPal payments'
      });
    }

    // Verify order exists
    const order = await getOrder(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order amount matches
    if (Math.abs(order.totalAmount - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match order total'
      });
    }

    // Create payment record
    const payment = PaymentModel.create({
      orderId,
      userId,
      amount,
      paymentMethod,
      cardDetails,
      upiId,
      paypalEmail
    });

    // Simulate payment gateway processing
    const gatewayResponse = simulatePaymentGateway(paymentMethod, amount);

    if (gatewayResponse.success) {
      // Update payment status to completed
      PaymentModel.updateStatus(payment.id, 'completed', gatewayResponse.transactionId);
      
      // Update order status
      await updateOrderPayment(orderId, 'completed', paymentMethod);

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          ...payment,
          status: 'completed',
          transactionId: gatewayResponse.transactionId
        }
      });
    } else {
      // Update payment status to failed
      PaymentModel.updateStatus(payment.id, 'failed');

      res.status(400).json({
        success: false,
        message: gatewayResponse.message,
        data: {
          ...payment,
          status: 'failed'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// Get payment by ID
exports.getPaymentById = (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = PaymentModel.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

// Get payment by order ID
exports.getPaymentByOrderId = (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = PaymentModel.findByOrderId(orderId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this order'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

// Get user's payment history
exports.getUserPayments = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const payments = PaymentModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Get all payments (admin)
exports.getAllPayments = (req, res) => {
  try {
    const payments = PaymentModel.findAll();

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const payment = PaymentModel.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const refundedPayment = PaymentModel.refund(paymentId);

    if (!refundedPayment) {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund this payment (not completed or already refunded)'
      });
    }

    // Update order status to cancelled
    await axios.put(`${ORDER_SERVICE_URL}/api/orders/${payment.orderId}/cancel`);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refundedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
};

// Get payment statistics (admin)
exports.getStatistics = (req, res) => {
  try {
    const stats = PaymentModel.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'payment-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};
