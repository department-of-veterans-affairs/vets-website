import { z } from 'zod';
import {
  dateOfBirthSchema,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
} from './veteran-identification';

/**
 * Schema for claimant identification with conditional validation
 * Validates whether claimant is the veteran and requires additional
 * information if they are a spouse or dependent
 * @type {import('zod').ZodSchema}
 */
export const claimantIdentificationSchema = z
  .object({
    isVeteran: z.enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message: 'Please select whether the claimant is the Veteran',
          };
        }
        return { message: ctx.defaultError };
      },
    }),
    claimantFullName: z.union([fullNameSchema, z.literal(''), z.undefined()]),
    claimantDateOfBirth: z.union([
      dateOfBirthSchema,
      z.literal(''),
      z.undefined(),
    ]),
    claimantSsn: z.union([ssnSchema, z.literal(''), z.undefined()]),
    claimantVaFileNumber: vaFileNumberSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // If claimant is not the veteran, all claimant fields are required (except VA file number)
    if (data.isVeteran === 'no') {
      // Validate full name - check for nested structure
      if (!data.claimantFullName || typeof data.claimantFullName !== 'object') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Claimant's full name is required",
          path: ['claimantFullName'],
        });
      } else {
        // Validate individual name fields
        if (!data.claimantFullName.first) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'First name is required',
            path: ['claimantFullName', 'first'],
          });
        }
        if (!data.claimantFullName.last) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Last name is required',
            path: ['claimantFullName', 'last'],
          });
        }
      }

      // Validate date of birth
      if (!data.claimantDateOfBirth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date of birth is required',
          path: ['claimantDateOfBirth'],
        });
      }

      // Validate SSN
      if (!data.claimantSsn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Social Security Number is required',
          path: ['claimantSsn'],
        });
      }
    }
  });
