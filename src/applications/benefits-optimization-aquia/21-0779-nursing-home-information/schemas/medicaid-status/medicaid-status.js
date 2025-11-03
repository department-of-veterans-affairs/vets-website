import { z } from 'zod';

/**
 * Schema for medicaid status
 * Validates whether the patient is covered by Medicaid
 */
export const medicaidStatusSchema = z.enum(['yes', 'no'], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
      return {
        message: 'Please indicate if the patient is covered by Medicaid',
      };
    }
    return { message: ctx.defaultError };
  },
});

/**
 * Complete medicaid status schema
 */
export const currentMedicaidStatusSchema = z.object({
  currentlyCoveredByMedicaid: medicaidStatusSchema,
});
