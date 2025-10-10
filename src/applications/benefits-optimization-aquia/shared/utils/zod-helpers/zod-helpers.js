/**
 * Utility functions for working with Zod validation
 * @module utils/zod-helpers
 */

/**
 * Flattens Zod error issues into a field errors object.
 * Properly handles array indices to create nested array structures for array field errors.
 * Converts Zod's path-based error format into a nested object/array structure matching the data shape.
 *
 * @param {import('zod').ZodError} zodError - The Zod error to flatten
 * @returns {Object} Object with field names as keys and error message strings/objects/arrays as values
 *
 * @example
 * // For simple field errors:
 * // Input: { path: ['email'], message: 'Invalid email' }
 * // Output: { email: 'Invalid email' }
 *
 * @example
 * // For array field errors:
 * // Input: { path: ['servicePeriods', 0, 'branchOfService'], message: 'Required' }
 * // Output: { servicePeriods: [{ branchOfService: 'Required' }] }
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
      // Handle nested paths (objects and arrays)
      let current = fieldErrors;

      for (let i = 0; i < issue.path.length - 1; i++) {
        const key = issue.path[i];
        const nextKey = issue.path[i + 1];

        // Check if next key is a number (array index)
        const isNextKeyArray = typeof nextKey === 'number';

        if (!current[key]) {
          // Initialize as array if next key is a number, otherwise as object
          current[key] = isNextKeyArray ? [] : {};
        }

        current = current[key];
      }

      // Set the final value
      const lastKey = issue.path[issue.path.length - 1];
      if (!current[lastKey]) {
        current[lastKey] = issue.message;
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
