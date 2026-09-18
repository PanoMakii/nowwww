/**
 * Standardized API Response Utilities for Recip52
 */

export function sendSuccess(res, { data = null, message = 'Success', statusCode = 200, meta = null } = {}) {
  const responsePayload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendError(res, { error = 'ServerError', message = 'An error occurred', statusCode = 500, details = null } = {}) {
  const responsePayload = {
    success: false,
    error,
    message,
    ...(details !== null && { details }),
  };
  return res.status(statusCode).json(responsePayload);
}
