import { z } from 'zod';
import {
  CONTACT_PATTERNS,
  NAME_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for official's name
 */
export const officialNameSchema = z
  .string()
  .min(1, 'Official name is required')
  .max(100, 'Official name must be less than 100 characters')
  .regex(
    NAME_PATTERNS.STANDARD,
    VALIDATION_MESSAGES.NAME_INVALID || 'Please enter a valid name',
  );

/**
 * Schema for official's title
 */
export const officialTitleSchema = z
  .string()
  .min(1, 'Official title is required')
  .max(100, 'Official title must be less than 100 characters');

/**
 * Schema for official's phone
 */
export const officialPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(CONTACT_PATTERNS.PHONE_US, 'Phone number must be 10 digits');

/**
 * Schema for official's signature
 */
export const officialSignatureSchema = z
  .string()
  .min(1, 'Official signature is required')
  .max(100, 'Signature must be less than 100 characters');

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
 * Complete official info and signature schema
 */
export const officialInfoAndSignatureSchema = z.object({
  officialName: officialNameSchema,
  officialTitle: officialTitleSchema,
  officialPhone: officialPhoneSchema,
  officialSignature: officialSignatureSchema,
  signatureDate: signatureDateSchema,
  certificationAgreement: z.boolean().refine(val => val === true, {
    message:
      'You must certify that the information provided is true and correct',
  }),
});
