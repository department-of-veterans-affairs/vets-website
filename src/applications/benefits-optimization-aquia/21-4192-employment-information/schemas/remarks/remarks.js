import { z } from 'zod';

/**
 * Remarks schema for 21-4192 form
 * @module schemas/remarks
 */

/**
 * Schema for remarks field
 */
export const remarksFieldSchema = z
  .string()
  .max(2000, 'Remarks must be less than 2000 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete remarks schema
 */
export const remarksSchema = z.object({
  remarks: remarksFieldSchema,
});
