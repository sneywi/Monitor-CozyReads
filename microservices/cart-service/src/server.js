require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log('Cart Service running on port ${PORT}');
  console.log('Environment: ${process.env.NODE_ENV}');
  console.log('Health Check: http://localhost:${PORT}/api/cart/health');
  console.log('Product Service: ${process.env.PRODUCT_SERVICE_URL}');
  console.log('-------------------------------------------------');
});
