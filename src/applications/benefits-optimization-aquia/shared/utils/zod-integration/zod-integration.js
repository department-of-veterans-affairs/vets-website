/**
 * @module utils/zod-integration
 * @description Comprehensive utilities for integrating Zod validation with VA forms.
 * Provides error message formatting, field validation, and error transformation utilities.
 */

import { z } from 'zod';

/**
 * Formats a Zod issue path into a dot-notation string with array indices.
 * Converts paths like ['address', 0, 'street'] to 'address[0].street'
 * @private
 * @param {Array} path - Zod issue path array
 * @returns {string} Formatted path string or '_root' for empty paths
 */
function formatIssuePath(path) {
  if (!path || path.length === 0) {
    return '_root';
  }

  return path
    .map((p, i) => {
      // Handle array indices - wrap in brackets
      if (typeof path[i - 1] === 'string' && typeof p === 'number') {
        return `[${p}]`;
      }
      return p;
    })
    .join('.')
    .replace(/\.\[/g, '[');
}

/**
 * Handles string validation errors and returns appropriate user messages.
 * Maps Zod string validation types to user-friendly error messages.
 * @private
 * @param {Object} issue - Zod validation issue object
 * @param {string} issue.validation - Type of string validation that failed (email, url, regex, etc.)
 * @param {string} [issue.message] - Custom error message if provided
 * @returns {string} User-friendly error message
 */
function handleStringValidation(issue) {
  const { validation, message } = issue;

  if (validation === 'email')
    return message || 'Please enter a valid email address';
  if (validation === 'url') return message || 'Please enter a valid URL';
  if (validation === 'regex') return message || 'Invalid format';
  if (validation === 'uuid') return message || 'Invalid UUID format';
  if (validation === 'cuid') return message || 'Invalid CUID format';
  if (validation === 'datetime')
    return message || 'Please enter a valid date and time';

  return message || 'Invalid text format';
}

/**
 * Handles size validation errors for strings, arrays, numbers, etc.
 * Formats "too_small" and "too_big" Zod errors into readable messages.
 * @private
 * @param {Object} issue - Zod validation issue object
 * @param {number} [issue.minimum] - Minimum allowed size
 * @param {number} [issue.maximum] - Maximum allowed size
 * @param {number} [issue.exact] - Exact required size
 * @param {boolean} [issue.inclusive=true] - Whether the limit is inclusive
 * @param {string} [issue.message] - Custom error message if provided
 * @param {string} type - Type of size validation ('minimum' or 'maximum')
 * @returns {string} User-friendly error message with "at least" or "at most" phrasing
 */
function handleSizeValidation(issue, type) {
  const { minimum, maximum, exact, inclusive = true, message } = issue;

  if (message && type === 'minimum') {
    if (message.includes('expected string to have >=')) {
      const match = message.match(/>=(\d+) characters?/);
      if (match) {
        return `Must have at least ${match[1]} characters`;
      }
    }
    if (message.includes('expected number to be >=')) {
      const match = message.match(/>=(\d+)/);
      if (match) {
        return `Must be greater than or equal to ${match[1]}`;
      }
    }
  }

  if (typeof exact === 'number') {
    return `Must be exactly ${exact} characters`;
  }

  if (type === 'minimum') {
    const operator = inclusive !== false ? 'at least' : 'more than';
    return message || `Must have ${operator} ${minimum} characters`;
  }

  if (type === 'maximum') {
    const operator = inclusive !== false ? 'at most' : 'less than';
    return message || `Must have ${operator} ${maximum} characters`;
  }

  return message || 'Invalid length';
}

/**
 * Converts Zod validation errors to user-friendly messages
 * @param {import('zod').ZodError} zodError - Zod error object containing validation issues
 * @returns {string|null|undefined} User-friendly error message, null if no errors, or undefined if code not found
 * @example
 * ```javascript
 * const schema = z.string().email();
 * const result = schema.safeParse('invalid-email');
 * if (!result.success) {
 *   const message = zodErrorToMessage(result.error);
 *   // Returns: "Please enter a valid email address"
 * }
 * ```
 */
export const zodErrorToMessage = zodError => {
  if (!zodError?.issues?.length) return null;

  const issue = zodError.issues[0];
  const { code, message } = issue;

  if (code === 'too_small') {
    if (
      message &&
      (message.includes('at least') || message.includes('greater'))
    ) {
      return message;
    }
    return handleSizeValidation(issue, 'minimum');
  }

  if (code === 'too_big') {
    if (message && (message.includes('at most') || message.includes('less'))) {
      return message;
    }
    return handleSizeValidation(issue, 'maximum');
  }

  const errorMessageMap = {
    /* eslint-disable camelcase */
    invalid_type: message || 'Invalid input type',
    invalid_literal: message || 'Invalid value',
    unrecognized_keys: message || 'Unknown field',
    invalid_union: message || 'Invalid selection',
    invalid_union_discriminator: message || 'Invalid option',
    invalid_enum_value: message || 'Please select a valid option',
    invalid_arguments: message || 'Invalid arguments',
    invalid_return_type: message || 'Invalid return type',
    invalid_date: message || 'Please enter a valid date',
    invalid_string: handleStringValidation(issue),
    invalid_intersection_types: message || 'Validation failed',
    not_multiple_of: message || 'Invalid number',
    not_finite: message || 'Must be a finite number',
    custom: message || 'Validation failed',
    /* eslint-enable camelcase */
  };

  return errorMessageMap[code] || message || 'Validation failed';
};

/**
 * Get user-friendly error message for a Zod error code.
 * @param {string} code - Zod error code
 * @returns {string|null|undefined} User-friendly message
 */
export const getZodErrorMessage = code => {
  if (code === null) return null;
  if (code === undefined) return null;

  /* eslint-disable camelcase */
  const messages = {
    required: 'This field is required',
    invalid_type: 'Please enter a valid value',
    invalid_literal: 'Invalid value',
    custom: 'Invalid value',
    invalid_union: 'Invalid value',
    invalid_union_discriminator: 'Invalid option',
    invalid_enum_value: 'Please select a valid option',
    unrecognized_keys: 'Unknown field',
    invalid_arguments: 'Invalid arguments',
    invalid_return_type: 'Invalid return type',
    invalid_date: 'Please enter a valid date',
    invalid_string: 'Invalid format',
    too_small: 'Value is too short',
    too_big: 'Value is too long',
    invalid_intersection_types: 'Validation failed',
    not_multiple_of: 'Invalid number',
    not_finite: 'Must be a finite number',
  };
  /* eslint-enable camelcase */

  return messages[code] || undefined;
};

/**
 * Validate data against a Zod schema and return formatted errors.
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {*} data - Data to validate
 * @returns {Object|null} Object with field errors or null if valid
 */
export const validateWithZod = (schema, data) => {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.issues.forEach(issue => {
        const path = formatIssuePath(issue.path);
        if (!errors[path]) {
          let formattedMessage;
          if (issue.code === 'too_small') {
            formattedMessage = handleSizeValidation(issue, 'minimum');
          } else if (issue.code === 'too_big') {
            formattedMessage = handleSizeValidation(issue, 'maximum');
          } else {
            formattedMessage = issue.message;
          }
          errors[path] = formattedMessage;
        }
      });
      return errors;
    }
    throw error;
  }
};

/**
 * Create a field validator function from a Zod schema.
 * @param {z.ZodSchema} schema - Zod schema for the field
 * @returns {Function} Validator function that returns error message or null
 */
export const createFieldValidator = schema => {
  return value => {
    try {
      if (
        (value === '' || value === undefined) &&
        schema._def &&
        schema._def.typeName === 'ZodOptional'
      ) {
        return null;
      }
      if (value === '' && schema.isOptional) {
        schema.parse(undefined);
        return null;
      }
      schema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError && error.issues.length > 0) {
        return zodErrorToMessage(error);
      }
      return 'Validation failed';
    }
  };
};

/**
 * Transform Zod errors to a flat object structure.
 * @param {z.ZodError|Array} zodError - Zod error object or array of issues
 * @returns {Object} Flat object with field paths as keys and error messages as values
 */
export const transformZodErrors = zodError => {
  const errors = {};

  if (Array.isArray(zodError)) {
    zodError.forEach(issue => {
      const path = formatIssuePath(issue.path);
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    });
    return errors;
  }

  if (!zodError || !zodError.issues) {
    return errors;
  }

  zodError.issues.forEach(issue => {
    const path = formatIssuePath(issue.path);
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return errors;
};
