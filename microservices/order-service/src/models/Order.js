// In-memory order storage

class OrderModel {
  constructor() {
    this.orders = [];
    this.currentId = 1;
  }

  // Create new order
  create(orderData) {
    const order = {
      id: this.currentId++,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: orderData.userId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      totalItems: orderData.totalItems,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentStatus: 'pending',
      paymentMethod: orderData.paymentMethod || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };

    this.orders.push(order);
    return order;
  }

  // Find order by ID
  findById(id) {
    return this.orders.find(order => order.id === parseInt(id));
  }

  // Find order by Order ID (string)
  findByOrderId(orderId) {
    return this.orders.find(order => order.orderId === orderId);
  }

  // Find all orders for a user
  findByUserId(userId) {
    return this.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all orders (admin)
  findAll() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Update order status
  updateStatus(id, status) {
    const order = this.findById(id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Update delivery date if shipped
    if (status === 'shipped') {
      order.shippedAt = new Date().toISOString();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date().toISOString();
    }

    return order;
  }

  // Update payment status
  updatePaymentStatus(id, paymentStatus, paymentMethod) {
    const order = this.findById(id);
    if (!order) return null;

    order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    order.updatedAt = new Date().toISOString();

    // Auto-update order status if payment confirmed
    if (paymentStatus === 'completed') {
      order.status = 'confirmed';
      order.paidAt = new Date().toISOString();
    }

    return order;
  }

  // Cancel order
  cancel(id) {
    const order = this.findById(id);
    if (!order) return null;

    if (order.status === 'delivered' || order.status === 'shipped') {
      return null; // Cannot cancel shipped/delivered orders
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // Calculate estimated delivery (5-7 business days)
  calculateEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toISOString();
  }

  // Get order statistics (for admin dashboard)
  getStatistics() {
    const total = this.orders.length;
    const pending = this.orders.filter(o => o.status === 'pending').length;
    const confirmed = this.orders.filter(o => o.status === 'confirmed').length;
    const processing = this.orders.filter(o => o.status === 'processing').length;
    const shipped = this.orders.filter(o => o.status === 'shipped').length;
    const delivered = this.orders.filter(o => o.status === 'delivered').length;
    const cancelled = this.orders.filter(o => o.status === 'cancelled').length;

    const totalRevenue = this.orders
      .filter(o => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue: Math.round(totalRevenue * 100) / 100
    };
  }
}

// Export singleton instance
module.exports = new OrderModel();
