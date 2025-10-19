import { z } from 'zod';

/**
 * Benefits information schemas for 21-4192 form
 * @module schemas/benefits-information
 */

/**
 * Schema for benefit entitlement question
 */
export const benefitEntitlementSchema = z
  .enum(['yes', 'no', ''])
  .optional()
  .or(z.literal(''));

/**
 * Complete benefits information schema
 */
export const benefitsInformationSchema = z.object({
  benefitEntitlement: benefitEntitlementSchema,
});
