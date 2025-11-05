import { z } from 'zod';

/**
 * Duty status details schemas for 21-4192 form
 * @module schemas/duty-status-details
 */

/**
 * Schema for duty status details text
 */
export const statusDetailsSchema = z
  .string()
  .max(500, 'Status details must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete duty status details schema
 */
export const dutyStatusDetailsSchema = z.object({
  statusDetails: statusDetailsSchema,
});
