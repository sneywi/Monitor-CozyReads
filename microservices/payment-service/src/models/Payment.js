// In-memory payment storage

class PaymentModel {
  constructor() {
    this.payments = [];
    this.currentId = 1;
  }

  // Create new payment
  create(paymentData) {
    const payment = {
      id: this.currentId++,
      paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderId: paymentData.orderId,
      userId: paymentData.userId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      status: 'pending', // pending, completed, failed, refunded
      transactionId: null,
      cardDetails: paymentData.cardDetails ? {
        last4: paymentData.cardDetails.cardNumber.slice(-4),
        cardType: this.detectCardType(paymentData.cardDetails.cardNumber)
      } : null,
      upiId: paymentData.upiId || null,
      paypalEmail: paymentData.paypalEmail || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.payments.push(payment);
    return payment;
  }

  // Find payment by ID
  findById(id) {
    return this.payments.find(payment => payment.id === parseInt(id));
  }

  // Find payment by Payment ID (string)
  findByPaymentId(paymentId) {
    return this.payments.find(payment => payment.paymentId === paymentId);
  }

  // Find payment by Order ID
  findByOrderId(orderId) {
    return this.payments.find(payment => payment.orderId === parseInt(orderId));
  }

  // Find all payments for a user
  findByUserId(userId) {
    return this.payments
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all payments (admin)
  findAll() {
    return this.payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Update payment status
  updateStatus(id, status, transactionId = null) {
    const payment = this.findById(id);
    if (!payment) return null;

    payment.status = status;
    payment.updatedAt = new Date().toISOString();

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    if (status === 'completed') {
      payment.completedAt = new Date().toISOString();
    } else if (status === 'failed') {
      payment.failedAt = new Date().toISOString();
    } else if (status === 'refunded') {
      payment.refundedAt = new Date().toISOString();
    }

    return payment;
  }

  // Process refund
  refund(id) {
    const payment = this.findById(id);
    if (!payment) return null;

    if (payment.status !== 'completed') {
      return null; // Can only refund completed payments
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date().toISOString();
    payment.updatedAt = new Date().toISOString();
    return payment;
  }

  // Detect card type from number
  detectCardType(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    if (firstDigit === '6') return 'Discover';
    return 'Unknown';
  }

  // Get payment statistics
  getStatistics() {
    const total = this.payments.length;
    const completed = this.payments.filter(p => p.status === 'completed').length;
    const pending = this.payments.filter(p => p.status === 'pending').length;
    const failed = this.payments.filter(p => p.status === 'failed').length;
    const refunded = this.payments.filter(p => p.status === 'refunded').length;

    const totalRevenue = this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedAmount = this.payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total,
      completed,
      pending,
      failed,
      refunded,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      refundedAmount: Math.round(refundedAmount * 100) / 100,
      netRevenue: Math.round((totalRevenue - refundedAmount) * 100) / 100
    };
  }
}

// Export singleton instance
module.exports = new PaymentModel();
