import { logger } from '../logger';

/**
 * Debug utility for validation logging.
 * Only outputs in development environment when explicitly enabled.
 *
 * @param {string} fieldName - Name of the field being validated
 * @param {Object} validation - Validation state object
 * @param {string} validation.error - Current error message
 * @param {boolean} validation.touched - Whether field has been touched
 * @param {boolean} validation.valid - Whether field is valid
 * @param {boolean} [enabled=false] - Whether debug logging is enabled
 */
export const debugValidation = (fieldName, validation, enabled = false) => {
  if (!enabled) return;

  logger.debug(`Validation Debug: ${fieldName}`, {
    state: validation,
    error: validation.error,
    touched: validation.touched,
    valid: validation.valid,
  });
};
