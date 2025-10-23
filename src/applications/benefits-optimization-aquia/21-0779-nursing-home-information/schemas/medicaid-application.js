import { z } from 'zod';

/**
 * Schema for medicaid application status
 * Validates whether the patient has applied for Medicaid
 */
export const medicaidApplicationStatusSchema = z.enum(['yes', 'no'], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
      return {
        message: 'Please indicate if the patient has applied for Medicaid',
      };
    }
    return { message: ctx.defaultError };
  },
});

/**
 * Complete medicaid application schema
 */
export const medicaidApplicationSchema = z.object({
  hasAppliedForMedicaid: medicaidApplicationStatusSchema,
});
