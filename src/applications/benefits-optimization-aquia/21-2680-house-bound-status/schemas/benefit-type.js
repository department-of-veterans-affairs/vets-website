import { z } from 'zod';
import { BENEFIT_TYPES } from '../constants';

/**
 * Schema for benefit type selection
 */
export const benefitTypeSchema = z.enum(
  [BENEFIT_TYPES.SMC, BENEFIT_TYPES.SMP],
  {
    errorMap: () => ({ message: 'Please select a benefit type' }),
  },
);

/**
 * Complete benefit type page schema
 */
export const benefitTypePageSchema = z.object({
  benefitType: benefitTypeSchema,
});
