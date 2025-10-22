import { z } from 'zod';
import { fullNameSchema } from '@bio-aquia/shared/schemas/name';
import { ID_PATTERNS } from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for Social Security Number
 */
export const veteranSSNSchema = z
  .string()
  .min(1, 'Social Security Number is required')
  .transform(val => val?.replace(/-/g, ''))
  .refine(val => ID_PATTERNS.SSN.test(val), {
    message: 'SSN must be 9 digits',
  });

/**
 * Schema for VA file number (optional)
 */
export const veteranFileNumberSchema = z
  .string()
  .refine(val => !val || /^\d{8,9}$/.test(val), {
    message: 'VA file number must be 8 or 9 digits',
  })
  .optional()
  .or(z.literal(''));

/**
 * Schema for service number (optional)
 */
export const veteranServiceNumberSchema = z
  .string()
  .max(20, 'Service number must be less than 20 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for date of birth
 */
export const veteranDOBSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Date of birth cannot be in the future');

/**
 * Schema for claimant status
 */
export const isVeteranClaimantSchema = z.enum(['yes', 'no'], {
  errorMap: () => ({ message: 'Please indicate if you are the Veteran' }),
});

/**
 * Page schema for veteran identity page (name, SSN, DOB only)
 */
export const veteranIdentificationPageSchema = z.object({
  veteranFullName: fullNameSchema,
  veteranSSN: veteranSSNSchema,
  veteranDOB: veteranDOBSchema,
});

/**
 * Complete veteran identification schema
 */
export const veteranIdentificationSchema = z.object({
  veteranFullName: fullNameSchema,
  veteranSSN: veteranSSNSchema,
  veteranFileNumber: veteranFileNumberSchema,
  veteranServiceNumber: veteranServiceNumberSchema,
  veteranDOB: veteranDOBSchema,
  isVeteranClaimant: isVeteranClaimantSchema,
});
