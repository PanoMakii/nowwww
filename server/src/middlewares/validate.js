import { schemas } from '../validators/schemas.js';
import { sendError } from '../utils/response.js';

/**
 * Validation middleware factory
 * @param {string|Function} validator - Name of schema in schemas object or a custom validator function
 * @param {string} source - 'body' | 'query' | 'params'
 */
export function validate(validator, source = 'body') {
  return (req, res, next) => {
    const validatorFn = typeof validator === 'function' ? validator : schemas[validator];

    if (!validatorFn) {
      console.warn(`[Validator] Schema "${validator}" not found, skipping.`);
      return next();
    }

    const target = req[source] || {};
    const errors = validatorFn(target);

    if (errors && errors.length > 0) {
      return sendError(res, {
        error: 'ValidationError',
        message: 'Invalid request data provided.',
        statusCode: 400,
        details: errors,
      });
    }

    next();
  };
}
