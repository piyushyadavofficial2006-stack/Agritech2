const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect private routes for authenticated users
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agritech_super_secret_jwt_key_2025_secure');

      // Fetch user from MongoDB excluding password
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User account not found. Authorization denied.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired authorization token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: No token provided.' });
  }
};

// Admin authorization middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
};

module.exports = { protect, adminOnly };
