import { z } from 'zod';

/**
 * Schema for medicaid facility approval status
 * Validates whether the nursing home is a Medicaid-approved facility
 */
export const medicaidFacilityStatusSchema = z.enum(['yes', 'no'], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
      return {
        message:
          'Please indicate if the nursing home is a Medicaid-approved facility',
      };
    }
    return { message: ctx.defaultError };
  },
});

/**
 * Complete medicaid facility schema
 */
export const medicaidFacilitySchema = z.object({
  isMedicaidApproved: medicaidFacilityStatusSchema,
});
