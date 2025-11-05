// API Configuratio ->All microservice endpoints
const API_CONFIG = {
    USER_SERVICE: 'http://localhost:3001/api/users',
    PRODUCT_SERVICE: 'http://localhost:3002/api/products',
    CART_SERVICE: 'http://localhost:3003/api/cart',
    ORDER_SERVICE: 'http://localhost:3004/api/orders',
    PAYMENT_SERVICE: 'http://localhost:3005/api/payments'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
