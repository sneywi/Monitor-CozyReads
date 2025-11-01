const OrderModel = require('../models/Order');
const axios = require('axios');

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3003';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// Helper: Get cart from Cart Service
async function getCart(userId) {
  try {
    const response = await axios.get(`${CART_SERVICE_URL}/api/cart/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    return null;
  }
}

// Helper: Clear cart after order
async function clearCart(userId) {
  try {
    await axios.delete(`${CART_SERVICE_URL}/api/cart/clear/${userId}`);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    return false;
  }
}

// Helper: Decrease product stock
async function decreaseStock(productId, quantity) {
  try {
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    const product = productResponse.data.data;
    
    const newStock = product.stock - quantity;
    await axios.patch(`${PRODUCT_SERVICE_URL}/api/products/${productId}/stock`, {
      stock: newStock
    });
    return true;
  } catch (error) {
    console.error('Error updating stock:', error.message);
    return false;
  }
}

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    // Validation
    if (!userId || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'User ID and shipping address are required'
      });
    }

    // Get user's cart
    const cart = await getCart(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Create order
    const order = OrderModel.create({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
      totalItems: cart.totalItems,
      shippingAddress
    });

    // Decrease stock for each item (in production, use transactions)
    for (const item of cart.items) {
      await decreaseStock(item.productId, item.quantity);
    }

    // Clear cart after successful order
    await clearCart(userId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Get all orders for a user
exports.getUserOrders = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const orders = OrderModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get all orders (admin)
exports.getAllOrders = (req, res) => {
  try {
    const orders = OrderModel.findAll();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    const order = OrderModel.updateStatus(orderId, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = OrderModel.cancel(orderId);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or cannot be cancelled (already shipped/delivered)'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get order statistics (admin)
exports.getStatistics = (req, res) => {
  try {
    const stats = OrderModel.getStatistics();

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
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};
