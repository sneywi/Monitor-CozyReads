
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log('Product Service running on port ${PORT}');
  console.log('Environment: ${process.env.NODE_ENV}');
  console.log('Health Check: http://localhost:${PORT}/api/products/health');
  console.log('Books loaded: 10 books available');
  console.log('------------------------------------------------');
});
