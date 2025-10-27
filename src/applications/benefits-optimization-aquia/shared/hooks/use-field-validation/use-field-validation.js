/**
 * @module hooks/use-field-validation
 * @description React hook for form field validation with Zod schemas.
 * Provides debounced validation and touch state management.
 */

import debounce from 'platform/utilities/data/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { logger, zodErrorToMessage } from '../../utils';

/** Debounce delay in milliseconds for validation */
const DEBOUNCE_DELAY_MS = 300;

/**
 * Validates a value against a Zod schema and returns a user-friendly error message.
 * Handles optional fields by trying undefined for empty values.
 * @private
 * @param {*} value - Value to validate
 * @param {import('zod').ZodSchema} schema - Zod schema for validation
 * @returns {string} Error message if validation fails, empty string otherwise
 */
const validateWithSchema = (value, schema) => {
  let valueToValidate = value;

  if (value === undefined || value === null || value === '') {
    const undefinedResult = schema.safeParse(undefined);
    valueToValidate = undefinedResult.success ? undefined : '';
  }

  const result = schema.safeParse(valueToValidate);

  if (!result.success && result.error?.issues?.length > 0) {
    // Use zodErrorToMessage for consistent formatting
    return zodErrorToMessage(result.error);
  }

  return '';
};

/**
 * Custom React hook for form field validation with debouncing and touch state management.
 *
 * Features:
 * - Debounced validation (300ms) to avoid excessive validation calls during typing
 * - Touch state management to show errors only after user interaction
 * - Loading state during async validation
 * - Automatic cleanup on component unmount
 * - Consistent error message formatting via zodErrorToMessage
 *
 * @param {import('zod').ZodSchema} schema - Zod schema for validation
 * @returns {Object} Validation state and control functions
 * @returns {Function} returns.validateField - Validates field value, optionally marking as touched
 * @returns {Function} returns.touchField - Marks field as touched to enable error display
 * @returns {string} returns.error - Current validation error message (only shown when touched)
 * @returns {boolean} returns.isValidating - Whether validation is in progress
 * @returns {boolean} returns.touched - Whether field has been touched by user
 *
 * @example
 * const schema = z.string().email();
 * const { validateField, touchField, error } = useFieldValidation(schema);
 *
 * // On input change
 * validateField(value);
 *
 * // On blur
 * touchField();
 */
export const useFieldValidation = schema => {
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [touched, setTouched] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const debouncedValidate = useMemo(
    () =>
      debounce(DEBOUNCE_DELAY_MS, async value => {
        if (!mountedRef.current) return;

        setIsValidating(true);

        try {
          if (schema?.safeParse) {
            const errorMessage = validateWithSchema(value, schema);

            if (mountedRef.current) {
              setError(errorMessage);
            }
          } else if (mountedRef.current) {
            setError('');
          }
        } catch (err) {
          if (mountedRef.current) {
            setError('');
            logger.warn('Validation error', err);
          }
        } finally {
          if (mountedRef.current) {
            setIsValidating(false);
          }
        }
      }),
    [schema],
  );

  /**
   * Validates field value and optionally marks it as touched
   * @param {*} value - Value to validate
   * @param {boolean} shouldTouch - Whether to mark field as touched or run immediate validation
   */
  const validateField = useCallback(
    (value, shouldTouch = false) => {
      // If shouldTouch is true, either mark as touched or run immediate validation
      if (shouldTouch) {
        // Cancel any pending debounced validations to prevent race conditions
        if (debouncedValidate.cancel) {
          debouncedValidate.cancel();
        }

        if (!touched) {
          setTouched(true);
        }
        // Run immediate validation when shouldTouch is true
        if (schema?.safeParse) {
          const errorMessage = validateWithSchema(value, schema);
          setError(errorMessage);
          setIsValidating(false);
        }
      } else {
        // Use debounced validation for normal typing
        debouncedValidate(value);
      }
    },
    [debouncedValidate, touched, schema],
  );

  /**
   * Marks field as touched to enable error display
   */
  const touchField = useCallback(
    () => {
      if (!touched) {
        setTouched(true);
      }
    },
    [touched],
  );

  return {
    validateField,
    touchField,
    error: touched ? error : '',
    isValidating,
    touched,
  };
};
