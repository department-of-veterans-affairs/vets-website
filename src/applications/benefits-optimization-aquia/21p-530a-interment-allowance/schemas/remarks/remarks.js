import { z } from 'zod';

/**
 * Additional remarks schemas for 21P-530a form
 * @module schemas/remarks
 */

/**
 * Schema for additional remarks text
 */
export const remarksSchema = z
  .string()
  .max(1000, 'Remarks must be less than 1000 characters')
  .optional()
  .or(z.literal(''));
