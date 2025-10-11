import { z } from 'zod';

/**
 * Official signature and certification schemas for 21P-530a form
 * @module schemas/official-signature
 */

/**
 * Schema for official's signature
 */
export const signatureSchema = z
  .string()
  .min(1, 'Official signature is required')
  .max(100, 'Signature must be less than 100 characters');

/**
 * Schema for official's title
 */
export const officialTitleSchema = z
  .string()
  .min(1, 'Official title is required')
  .max(100, 'Official title must be less than 100 characters');

/**
 * Schema for signature date
 */
export const signatureDateSchema = z
  .string()
  .min(1, 'Signature date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, 'Signature date cannot be in the future');

/**
 * Schema for remarks (optional)
 */
export const remarksSchema = z
  .string()
  .max(500, 'Remarks must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete official signature and certification schema
 */
export const officialSignatureSchema = z.object({
  officialSignature: signatureSchema,
  officialTitle: officialTitleSchema,
  signatureDate: signatureDateSchema,
  remarks: remarksSchema,
});
