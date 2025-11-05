// ============================================
// API CONFIGURATION
// All microservice endpoints
// ============================================

const API_CONFIG = {
    USER_SERVICE: 'http://10.31.88.122:3001/api/users',
    PRODUCT_SERVICE: 'http://10.31.88.122:3002/api/products',
    CART_SERVICE: 'http://10.31.88.122:3003/api/cart',
    ORDER_SERVICE: 'http://10.31.88.122:3004/api/orders',
    PAYMENT_SERVICE: 'http://10.31.88.122:3005/api/payments'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
