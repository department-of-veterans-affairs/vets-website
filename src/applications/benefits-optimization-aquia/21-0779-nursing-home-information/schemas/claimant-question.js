import { z } from 'zod';

/**
 * Schema for patient type selection
 * Validates whether the patient is a veteran or spouse/parent of a veteran
 */
export const patientTypeSchema = z.enum(['veteran', 'spouseOrParent'], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
      return {
        message:
          'Please select who is the patient in the nursing home facility',
      };
    }
    return { message: ctx.defaultError };
  },
});

/**
 * Complete claimant question schema
 */
export const claimantQuestionSchema = z.object({
  patientType: patientTypeSchema,
});
