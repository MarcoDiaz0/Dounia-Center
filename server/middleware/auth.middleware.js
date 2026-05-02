import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dounia-center-secret-key-change-in-production';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Extracts token from HTTP-only cookie (previously read from Authorization header)
const extractToken = (req) => req.cookies?.['dounia-token'] ?? null;

// ─── PROTECT ──────────────────────────────────────────────────────────────────

export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

// ─── AUTHORIZE ────────────────────────────────────────────────────────────────
// Unchanged — role check doesn't depend on where the token came from

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    next();
  };
};

// ─── OPTIONAL AUTH ────────────────────────────────────────────────────────────
// Attaches user to req if a valid cookie exists — silently continues if not

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // No token or invalid — continue unauthenticated
  }
  next();
};