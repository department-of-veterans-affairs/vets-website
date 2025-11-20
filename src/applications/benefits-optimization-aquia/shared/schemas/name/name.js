/**
 * @module schemas/name
 * @description Name validation schemas for VA forms including first, middle, last names and suffixes.
 * Provides comprehensive validation with pattern matching and length constraints.
 */

import { z } from 'zod';

import { isValidName, VALIDATION_MESSAGES } from '../../utils/validators';

/**
 * First name validation schema.
 * Validates first names with minimum 2 characters, maximum 30 characters.
 * Rejects numbers-only and special characters-only inputs.
 * @type {import('zod').ZodSchema<string>}
 * @example
 * firstNameSchema.parse('John') // 'John'
 * firstNameSchema.parse('J') // throws - too short
 * firstNameSchema.parse('123') // throws - numbers only
 */
export const firstNameSchema = z
  .string()
  .trim()
  .min(2, 'First name must be at least 2 characters')
  .max(30, 'First name must be 30 characters or less')
  .refine(val => isValidName(val), VALIDATION_MESSAGES.NAME_INVALID_FIRST);

/**
 * Middle name validation schema.
 * Optional field with maximum 30 characters.
 * Transforms empty strings to undefined.
 * @type {import('zod').ZodSchema<string | undefined>}
 * @example
 * middleNameSchema.parse('Marie') // 'Marie'
 * middleNameSchema.parse('') // undefined
 * middleNameSchema.parse(undefined) // undefined
 */
export const middleNameSchema = z
  .string()
  .trim()
  .max(30, 'Middle name must be 30 characters or less')
  .refine(val => {
    if (!val) return true; // Empty is valid for optional field
    return isValidName(val);
  }, VALIDATION_MESSAGES.NAME_INVALID_MIDDLE)
  .optional()
  .transform(val => (val === '' ? undefined : val));

/**
 * Last name validation schema.
 * Validates last names with minimum 2 characters, maximum 30 characters.
 * Rejects numbers-only and special characters-only inputs.
 * @type {import('zod').ZodSchema<string>}
 * @example
 * lastNameSchema.parse('Smith') // 'Smith'
 * lastNameSchema.parse('S') // throws - too short
 * lastNameSchema.parse('@@@') // throws - special chars only
 */
export const lastNameSchema = z
  .string()
  .trim()
  .min(2, 'Last name must be at least 2 characters')
  .max(30, 'Last name must be 30 characters or less')
  .refine(val => isValidName(val), VALIDATION_MESSAGES.NAME_INVALID_LAST);

/**
 * Name suffix validation schema.
 * Optional field for suffixes like Jr., Sr., III, etc.
 * Maximum 10 characters, transforms empty strings to undefined.
 * Validates against NAME_PATTERNS.SUFFIX pattern.
 * @type {import('zod').ZodSchema<string | undefined>}
 * @example
 * suffixSchema.parse('Jr.') // 'Jr.'
 * suffixSchema.parse('III') // 'III'
 * suffixSchema.parse('') // undefined
 */
export const suffixSchema = z
  .string()
  .trim()
  .max(10, 'Suffix must be 10 characters or less')
  .optional()
  .transform(val => (val === '' ? undefined : val))
  .refine(val => {
    if (!val) return true;
    // Suffix allows letters, spaces, and periods (Jr., Sr., II, III, etc.)
    return /^[a-zA-Z\s.]*$/.test(val);
  }, VALIDATION_MESSAGES.NAME_INVALID_SUFFIX || 'Invalid suffix format');

/**
 * Full name composite schema.
 * Combines first, middle, last names and suffix into a complete name object.
 * @type {import('zod').ZodSchema<{first: string, middle?: string, last: string, suffix?: string}>}
 * @example
 * fullNameSchema.parse({
 *   first: 'John',
 *   middle: 'Michael',
 *   last: 'Smith',
 *   suffix: 'Jr.'
 * })
 */
export const fullNameSchema = z.object({
  first: firstNameSchema,
  middle: middleNameSchema,
  last: lastNameSchema,
  suffix: suffixSchema,
});
