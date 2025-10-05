/**
 * @module @bio-aquia/shared/utils
 * @description Utility functions for VA form integration and validation
 */

/** Logging utilities */
export { logger } from './logger';

/** Error handling and collection */
export * from './error-handling';

/** VA component error transformations */
export { ERROR_TRANSFORMATIONS } from './error-transformations';

/** Zod validation helpers */
export * from './zod-helpers';

/** Zod to VA error integration */
export * from './zod-integration';

/** VA web component prop formatting */
export { createVAComponentProps } from './component-props';

/** Validation debugging utilities */
export { debugValidation } from './debug-utils';
