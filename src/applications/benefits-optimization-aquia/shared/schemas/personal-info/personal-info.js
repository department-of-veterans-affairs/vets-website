/**
 * @module schemas/personal-info
 * @description Personal information validation schemas for VA forms.
 * Includes date of birth, SSN, and VA file number validation.
 */

import { z } from 'zod';

import {
  isValidSSN,
  isValidVAFileNumber,
  VALIDATION_MESSAGES,
} from '../../utils/validators';

/**
 * Date of birth validation schema with age checks.
 * Validates ISO date format (YYYY-MM-DD).
 * Ensures date is not in the future and within 150 years.
 * @type {import('zod').ZodSchema<string>}
 * @example
 * dateOfBirthSchema.parse('1990-01-01') // '1990-01-01'
 * dateOfBirthSchema.parse('2050-01-01') // throws - future date
 * dateOfBirthSchema.parse('1850-01-01') // throws - too old
 */
export const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    // Validate ISO date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const birthDate = new Date(val);
    const today = new Date();
    return birthDate <= today;
  }, 'Date of birth cannot be in the future')
  .refine(val => {
    const birthDate = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age <= 150;
  }, 'Date of birth must be within the last 150 years');

/**
 * Social Security Number (SSN) validation schema.
 * Transforms formatted SSN to 9 digits only.
 * Rejects invalid SSN patterns per SSA rules:
 * - All zeros (000-00-0000)
 * - Sequential test patterns (123-45-6789, 999-99-9999)
 * - Invalid area numbers (000, 666, 900-999)
 * @type {import('zod').ZodSchema<string>}
 * @example
 * ssnSchema.parse('123-45-6789') // '123456789'
 * ssnSchema.parse('123 45 6789') // '123456789'
 * ssnSchema.parse('000-00-0000') // throws - invalid pattern
 */
export const ssnSchema = z
  .string()
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => isValidSSN(val), VALIDATION_MESSAGES.SSN_FORMAT);

/**
 * VA file number validation schema (optional).
 * Validates 8 or 9 digit VA file numbers.
 * Transforms empty strings to undefined.
 * @type {import('zod').ZodSchema<string | undefined>}
 * @example
 * vaFileNumberSchema.parse('12345678') // '12345678'
 * vaFileNumberSchema.parse('123456789') // '123456789'
 * vaFileNumberSchema.parse('') // undefined
 * vaFileNumberSchema.parse(undefined) // undefined
 */
export const vaFileNumberSchema = z
  .string()
  .trim()
  .transform(val => (val === '' ? undefined : val))
  .optional()
  .refine(val => isValidVAFileNumber(val), VALIDATION_MESSAGES.VA_FILE_FORMAT);

/**
 * Personal information composite schema.
 * Combines date of birth, SSN, and optional VA file number.
 * @type {import('zod').ZodSchema<{dateOfBirth: string, ssn: string, vaFileNumber?: string}>}
 * @example
 * personalInfoSchema.parse({
 *   dateOfBirth: '1990-01-01',
 *   ssn: '123-45-6789',
 *   vaFileNumber: '12345678'
 * })
 */
export const personalInfoSchema = z.object({
  dateOfBirth: dateOfBirthSchema,
  ssn: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
});

/**
 * Extended personal information schema with full name.
 * Includes all personal info fields plus full name structure.
 * @type {import('zod').ZodSchema}
 * @example
 * personalInfoWithNameSchema.parse({
 *   fullName: {
 *     first: 'John',
 *     middle: 'Michael',
 *     last: 'Smith',
 *     suffix: 'Jr.'
 *   },
 *   dateOfBirth: '1990-01-01',
 *   ssn: '123-45-6789'
 * })
 */
export const personalInfoWithNameSchema = z.object({
  fullName: z.object({
    first: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(30, 'First name must be 30 characters or less'),
    middle: z
      .string()
      .trim()
      .max(30, 'Middle name must be 30 characters or less')
      .optional()
      .transform(val => (val === '' ? undefined : val)),
    last: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(30, 'Last name must be 30 characters or less'),
    suffix: z
      .string()
      .trim()
      .max(10, 'Suffix must be 10 characters or less')
      .optional()
      .transform(val => (val === '' ? undefined : val)),
  }),
  dateOfBirth: dateOfBirthSchema,
  ssn: ssnSchema,
  vaFileNumber: vaFileNumberSchema,
});
