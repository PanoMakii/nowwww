import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  return sendError(res, {
    error: 'NotFound',
    message: `Endpoint does not exist: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
}

/**
 * Global Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || err.status || 500;
  let errorName = err.name || 'InternalServerError';
  let message = err.message || 'An unexpected server error occurred';
  let details = null;

  // JSON Body Parse Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorName = 'MalformedJSON';
    message = 'Request body contains invalid JSON syntax.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorName = 'InvalidToken';
    message = 'Authentication token is invalid or corrupted.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorName = 'TokenExpired';
    message = 'Authentication token has expired. Please sign in again.';
  }

  // PostgreSQL Errors
  if (err.code === '23505') {
    statusCode = 409;
    errorName = 'ConflictError';
    message = 'A record with this identifier already exists.';
    details = err.detail;
  }

  console.error(`[API Error] ${req.method} ${req.originalUrl} - ${errorName}: ${message}`);

  return sendError(res, {
    error: errorName,
    message,
    statusCode,
    details: details || (env.nodeEnv === 'development' ? err.stack : null),
  });
}

