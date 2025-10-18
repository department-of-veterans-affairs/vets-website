/**
 * Utility functions for working with Zod validation
 * @module utils/zod-helpers
 */

/**
 * Flattens Zod error issues into a field errors object.
 * For nested paths with 2+ levels, intermediate levels are skipped and only the first and last keys are used.
 * This creates a partially flattened structure ideal for form validation.
 *
 * @param {import('zod').ZodError} zodError - The Zod error to flatten
 * @returns {Object} Object with field names as keys and error message strings/objects as values
 *
 * @example
 * // For simple field errors:
 * // Input: { path: ['email'], message: 'Invalid email' }
 * // Output: { email: 'Invalid email' }
 *
 * @example
 * // For nested field errors (intermediate levels skipped):
 * // Input: { path: ['user', 'profile', 'bio'], message: 'Required' }
 * // Output: { user: { bio: 'Required' } }
 *
 * @example
 * // For array field errors:
 * // Input: { path: ['items', 1], message: 'Invalid' }
 * // Output: { items: { '1': 'Invalid' } }
 */
export const flattenZodError = zodError => {
  const fieldErrors = {};

  zodError.issues.forEach(issue => {
    if (issue.path.length === 0) {
      fieldErrors._root = issue.message;
    } else if (issue.path.length === 1) {
      const fieldName = issue.path[0];
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    } else {
      // Handle nested paths - skip intermediate levels
      // Only use first and last keys: path [a, b, c, d] becomes { a: { d: 'message' } }
      const firstKey = issue.path[0];
      const lastKey = issue.path[issue.path.length - 1];

      if (!fieldErrors[firstKey]) {
        fieldErrors[firstKey] = {};
      }

      if (!fieldErrors[firstKey][lastKey]) {
        fieldErrors[firstKey][lastKey] = issue.message;
      }
    }
  });

  return fieldErrors;
};

/**
 * Creates a validation error handler for form pages with namespace support.
 * Returns a function that validates data against a schema and returns flattened field errors.
 * Useful for form pages that need to validate a specific section of form data.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {string} [namespace] - Optional namespace for the data section (e.g., 'veteranInfo')
 * @returns {Function} Function that takes form data and returns field errors object
 *
 * @example
 * const validator = createValidationErrorHandler(veteranInfoSchema, 'veteranInfo');
 * const errors = validator({ veteranInfo: { firstName: '', lastName: 'Smith' } });
 * // Returns: { firstName: 'First name is required' }
 */
export const createValidationErrorHandler = (schema, namespace) => {
  return data => {
    const dataToValidate = namespace && data ? data[namespace] : data;
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      return flattenZodError(result.error);
    }
    return {};
  };
};

/**
 * Creates a page validator for form pages with namespace support.
 * Returns a function that validates data against a schema and returns a boolean.
 * Useful for checking if a form page is valid before allowing navigation.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {string} [namespace] - Optional namespace for the data section (e.g., 'veteranInfo')
 * @returns {Function} Function that takes form data and returns true if valid, false otherwise
 *
 * @example
 * const isValid = createPageValidator(veteranInfoSchema, 'veteranInfo');
 * const canContinue = isValid({ veteranInfo: { firstName: 'John', lastName: 'Smith' } });
 * // Returns: true or false
 */
export const createPageValidator = (schema, namespace) => {
  return data => {
    const dataToValidate = namespace && data ? data[namespace] : data;
    const result = schema.safeParse(dataToValidate);
    return result.success;
  };
};
