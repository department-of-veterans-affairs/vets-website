import { useCallback, useState } from 'react';
import { ZodError } from 'zod';

import { flattenZodError } from '@bio-aquia/shared/utils/zod-helpers';

/**
 * Hook for form validation using Zod schemas
 * @param {import('zod').ZodSchema} schema - Zod schema for validation
 * @returns {Object} Validation utilities
 * @returns {Function} validate - Validates entire form data
 * @returns {Function} validateField - Validates a single field
 * @returns {Function} clearErrors - Clears all validation errors
 * @returns {Object} errors - Current validation errors
 * @returns {boolean} isValid - Whether the form is valid
 */
export const useFormValidation = schema => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(
    data => {
      try {
        schema.parse(data);
        setErrors({});
        setIsValid(true);
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors = flattenZodError(error);
          setErrors(fieldErrors);
          setIsValid(false);
          return false;
        }
        throw error;
      }
    },
    [schema],
  );

  const validateField = useCallback(
    (fieldName, value, _fullData = {}) => {
      // If schema doesn't have shape, can't validate individual fields
      if (!schema.shape || !schema.shape[fieldName]) {
        return true;
      }

      try {
        const fieldSchema = schema.shape[fieldName];
        fieldSchema.parse(value);

        // Clear error for this field if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          // Get the error message from the ZodError
          // ZodError uses 'issues' array, not 'errors'
          const errorMessage =
            error.issues?.[0]?.message || 'Validation failed';

          setErrors(prev => ({
            ...prev,
            [fieldName]: errorMessage,
          }));
          return false;
        }
      }
      return true;
    },
    [schema],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  return {
    validate,
    validateField,
    clearErrors,
    errors,
    isValid,
  };
};
