import { z } from 'zod';

/**
 * Duty status schemas for 21-4192 form
 * @module schemas/duty-status
 */

/**
 * Schema for Reserve or National Guard duty status question
 */
export const reserveOrGuardStatusSchema = z
  .enum(['yes', 'no', ''])
  .optional()
  .or(z.literal(''));

/**
 * Complete duty status schema
 */
export const dutyStatusSchema = z.object({
  reserveOrGuardStatus: reserveOrGuardStatusSchema,
});
