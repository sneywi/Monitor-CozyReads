const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,           
      userId: user.id,       
      email: user.email,
      name: user.name        
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Remove password from user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, name, address, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = UserModel.create({
      email,
      password: hashedPassword,
      name,
      address,
      phone
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: sanitizeUser(user),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get user profile (authenticated)
exports.getProfile = (req, res) => {
  try {
    const user = UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update user profile (authenticated)
exports.updateProfile = async (req, res) => {
  try {
    const { name, address, phone, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    // If password is being updated, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = UserModel.update(req.user.id, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizeUser(updatedUser)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};
