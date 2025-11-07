import { z } from 'zod';

/**
 * Veteran contact information schemas for 21-4192 form
 * @module schemas/veteran-contact-information
 */

/**
 * Schema for Social Security Number
 */
export const ssnSchema = z
  .string()
  .min(1, 'Social Security Number is required')
  .transform(val => val?.replace(/-/g, '')) // Remove dashes for validation
  .refine(val => /^\d{9}$/.test(val), {
    message: 'SSN must be 9 digits',
  });

/**
 * Schema for VA file number (optional)
 */
export const vaFileNumberSchema = z
  .string()
  .refine(val => !val || /^\d{8,9}$/.test(val), {
    message: 'VA file number must be 8 or 9 digits',
  })
  .optional()
  .or(z.literal(''));

/**
 * Complete veteran contact information schema for 21-4192
 */
export const veteranContactInformationSchema = z.object({
  ssn: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
});
