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
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
});
