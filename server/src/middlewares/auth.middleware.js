import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Authentication Middleware: Validates Bearer JWT
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Access token is missing or malformed',
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
}
