/**
 * @module @bio-aquia/shared/utils
 * @description Utility functions for VA form integration and validation
 */

/** Logging utilities */
export { logger } from '@bio-aquia/shared/utils/logger';

/** Error handling and collection */
export * from '@bio-aquia/shared/utils/error-handling';

/** VA component error transformations */
export {
  ERROR_TRANSFORMATIONS,
} from '@bio-aquia/shared/utils/error-transformations';

/** Zod validation helpers */
export * from '@bio-aquia/shared/utils/zod-helpers';

/** Zod to VA error integration */
export * from '@bio-aquia/shared/utils/zod-integration';

/** VA web component prop formatting */
export { createVAComponentProps } from './component-props';

/** Validation debugging utilities */
export { debugValidation } from './debug-utils';

/** Validation functions (platform + custom validators) */
export * from '@bio-aquia/shared/utils/validators';

/** Form submission utilities */
export { customSubmit } from '@bio-aquia/shared/utils/submit';
