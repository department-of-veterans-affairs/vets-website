/**
 * Utility functions for working with Zod validation
 */

/**
 * Flattens Zod error issues into a field errors object
 * @param {import('zod').ZodError} zodError - The Zod error to flatten
 * @returns {Object} Object with field names as keys and error message strings as values
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
      const topLevel = issue.path[0];

      if (!fieldErrors[topLevel]) {
        fieldErrors[topLevel] = {};
      }

      if (typeof fieldErrors[topLevel] === 'object') {
        const lastKey = issue.path[issue.path.length - 1];
        if (!fieldErrors[topLevel][lastKey]) {
          fieldErrors[topLevel][lastKey] = issue.message;
        }
      }
    }
  });

  return fieldErrors;
};

/**
 * Creates a validation error handler for form pages with namespace support
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {string} [namespace] - Optional namespace for the data section
 * @returns {Function} Function that validates data and returns field errors
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
 * Creates a page validator for form pages with namespace support
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {string} [namespace] - Optional namespace for the data section
 * @returns {Function} Function that returns boolean indicating if data is valid
 */
export const createPageValidator = (schema, namespace) => {
  return data => {
    const dataToValidate = namespace && data ? data[namespace] : data;
    const result = schema.safeParse(dataToValidate);
    return result.success;
  };
};
