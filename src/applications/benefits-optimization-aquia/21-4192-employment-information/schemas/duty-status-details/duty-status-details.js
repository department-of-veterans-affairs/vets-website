import { z } from 'zod';

/**
 * Duty status details schemas for 21-4192 form
 * @module schemas/duty-status-details
 */

/**
 * Schema for current duty status text
 */
export const currentDutyStatusSchema = z
  .string()
  .max(500, 'Current duty status must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for disabilities prevent duties question
 */
export const disabilitiesPreventDutiesSchema = z
  .enum(['yes', 'no', ''])
  .optional()
  .or(z.literal(''));

/**
 * Complete duty status details schema
 */
export const dutyStatusDetailsSchema = z.object({
  currentDutyStatus: currentDutyStatusSchema,
  disabilitiesPreventDuties: disabilitiesPreventDutiesSchema,
});
