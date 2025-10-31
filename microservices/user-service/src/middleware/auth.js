const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      // Attach user info to request
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

module.exports = { authenticateToken };
