/**
 * @module utils/component-props
 * @description Utilities for creating VA web component props with proper error handling.
 * Bridges validation state with VA component requirements.
 */

import { ERROR_TRANSFORMATIONS } from '../error-transformations';
import { logger } from '../logger';

/**
 * Creates props for VA web components based on validation state.
 * Handles error transformation and display logic for different VA component types.
 *
 * @param {string} componentType - Type of VA component (e.g., 'va-text-input', 'va-checkbox')
 * @param {string} error - Error message to display
 * @param {boolean} [touched=false] - Whether the field has been touched
 * @param {boolean} [forceShowErrors=false] - Force error display regardless of touch state
 * @returns {Object} Props object suitable for the specified VA component
 */
export const createVAComponentProps = (
  componentType,
  error,
  touched = false,
  forceShowErrors = false,
) => {
  const transformation = ERROR_TRANSFORMATIONS[componentType];

  if (!transformation) {
    logger.warn(
      `No error transformation found for component: ${componentType}`,
    );
    return { error: error || null };
  }

  const normalizedError = transformation.normalizeError(error);
  const shouldShowError = forceShowErrors || touched;

  return transformation.getErrorProps(
    shouldShowError ? normalizedError : null,
    touched,
    forceShowErrors,
  );
};
