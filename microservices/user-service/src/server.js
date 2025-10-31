require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('================================================');
  console.log(`User Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health Check: http://localhost:${PORT}/api/users/health`);
  console.log('================================================');
});
