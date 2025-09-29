import { z } from 'zod';

import { VALIDATION_MESSAGES } from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Personal information schemas for 21-0779 form
 */

// SSN schema - accepts formatted SSN with dashes (XXX-XX-XXXX)
export const ssnSchema = z
  .string()
  .transform(val => val?.replace(/-/g, '')) // Remove dashes for validation
  .refine(val => !val || /^\d{9}$/.test(val), {
    message: VALIDATION_MESSAGES.SSN_FORMAT || 'SSN must be 9 digits',
  })
  .optional();

// VA file number schema - accepts 8-9 digits
export const vaFileNumberSchema = z
  .string()
  .refine(val => !val || /^\d{8,9}$/.test(val), {
    message:
      VALIDATION_MESSAGES.VA_FILE_FORMAT ||
      'VA file number must be 8 or 9 digits',
  })
  .optional();

// Date of birth schema
export const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date');

// Full name schema
export const fullNameSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  middle: z.string().optional(),
  last: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
});

// Complete personal info schema
export const personalInfoSchema = z.object({
  fullName: fullNameSchema,
  dateOfBirth: dateOfBirthSchema,
  ssn: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
});

// Individual field exports
export const firstNameSchema = z.string().min(1, 'First name is required');
export const lastNameSchema = z.string().min(1, 'Last name is required');
export const middleNameSchema = z.string().optional();
export const suffixSchema = z.string().optional();
