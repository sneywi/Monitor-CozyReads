
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log(`Payment Service running on port ${PORT}`);
  console.log('Environment: ${process.env.NODE_ENV}`);
  console.log(`Health Check: http://localhost:${PORT}/api/payments/health`);
  console.log('Order Service: ${process.env.ORDER_SERVICE_URL}`);
  console.log(`Payment Methods: Credit Card, Debit Card, PayPal, UPI`);
  console.log('------------------------------------------------');
});
