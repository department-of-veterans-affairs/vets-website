import { z } from 'zod';

/**
 * Benefits details schemas for 21-4192 form
 * @module schemas/benefits-details
 */

/**
 * Schema for benefit details text
 */
export const benefitDetailsSchema = z
  .string()
  .max(500, 'Benefit details must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete benefits details schema
 */
export const benefitsDetailsSchema = z.object({
  benefitDetails: benefitDetailsSchema,
});
