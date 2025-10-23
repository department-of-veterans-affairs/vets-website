import { z } from 'zod';
import {
  NAME_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Veteran information schemas for 21-4192 form
 * @module schemas/veteran-information
 */

/**
 * Schema for veteran's first name
 */
export const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .max(30, 'First name must be less than 30 characters')
  .regex(
    NAME_PATTERNS.STANDARD,
    VALIDATION_MESSAGES.NAME_INVALID ||
      'Must contain only letters, spaces, hyphens, and apostrophes',
  );

/**
 * Schema for veteran's middle name (optional)
 */
export const middleNameSchema = z
  .string()
  .max(30, 'Middle name must be less than 30 characters')
  .regex(
    NAME_PATTERNS.OPTIONAL,
    VALIDATION_MESSAGES.NAME_INVALID ||
      'Must contain only letters, spaces, hyphens, and apostrophes',
  )
  .optional()
  .or(z.literal(''));

/**
 * Schema for veteran's last name
 */
export const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(30, 'Last name must be less than 30 characters')
  .regex(
    NAME_PATTERNS.STANDARD,
    VALIDATION_MESSAGES.NAME_INVALID ||
      'Must contain only letters, spaces, hyphens, and apostrophes',
  );

/**
 * Schema for veteran's full name
 */
export const fullNameSchema = z.object({
  first: firstNameSchema,
  middle: middleNameSchema,
  last: lastNameSchema,
});

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
 * Schema for date of birth
 */
export const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date');
// Note: Future date validation removed to support Star Trek themed test data

/**
 * Complete veteran information schema for 21-4192
 */
export const veteranInformationSchema = z.object({
  fullName: fullNameSchema,
  dateOfBirth: dateOfBirthSchema,
  ssn: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
});
