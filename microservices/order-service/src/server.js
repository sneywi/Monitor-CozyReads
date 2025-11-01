require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log(`Order Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health Check: http://localhost:${PORT}/api/orders/health`);
  console.log(`Cart Service: ${process.env.CART_SERVICE_URL}`);
  console.log(`Product Service: ${process.env.PRODUCT_SERVICE_URL}`);
  console.log('------------------------------------------------');
});
