import { z } from 'zod';

/**
 * Schema for Medicaid start date
 */
export const medicaidStartDateSchema = z
  .string()
  .refine(val => {
    if (!val) return true; // Optional
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .optional();

/**
 * Schema for monthly out-of-pocket amount
 */
export const monthlyOutOfPocketSchema = z
  .string()
  .min(1, 'Monthly out-of-pocket amount is required')
  .refine(val => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return !Number.isNaN(num) && num >= 0;
  }, 'Please enter a valid dollar amount');

/**
 * Complete Medicaid and cost information schema
 */
export const medicaidAndCostSchema = z
  .object({
    isMedicaidApproved: z.enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message: 'Please indicate if the nursing home is Medicaid-approved',
          };
        }
        return { message: ctx.defaultError };
      },
    }),
    hasAppliedForMedicaid: z.enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message: 'Please indicate if the patient has applied for Medicaid',
          };
        }
        return { message: ctx.defaultError };
      },
    }),
    isCurrentlyCovered: z.enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message:
              'Please indicate if the patient is currently covered by Medicaid',
          };
        }
        return { message: ctx.defaultError };
      },
    }),
    medicaidStartDate: medicaidStartDateSchema,
    monthlyOutOfPocket: monthlyOutOfPocketSchema,
  })
  .refine(
    data => {
      // If currently covered by Medicaid, start date is required
      if (data.isCurrentlyCovered === 'yes') {
        return !!data.medicaidStartDate;
      }
      return true;
    },
    {
      message: 'Medicaid start date is required when currently covered',
      path: ['medicaidStartDate'],
    },
  );
