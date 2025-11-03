import { z } from 'zod';
import {
  CONTACT_PATTERNS,
  NAME_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for nursing official's first name
 */
export const nursingOfficialFirstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .max(30, 'First name must be less than 30 characters')
  .regex(
    NAME_PATTERNS.STANDARD,
    VALIDATION_MESSAGES.NAME_INVALID ||
      'Must contain only letters, spaces, hyphens, and apostrophes',
  );

/**
 * Schema for nursing official's last name
 */
export const nursingOfficialLastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(30, 'Last name must be less than 30 characters')
  .regex(
    NAME_PATTERNS.STANDARD,
    VALIDATION_MESSAGES.NAME_INVALID ||
      'Must contain only letters, spaces, hyphens, and apostrophes',
  );

/**
 * Schema for nursing official's job title
 */
export const nursingOfficialJobTitleSchema = z
  .string()
  .min(1, 'Job title is required')
  .max(100, 'Job title must be less than 100 characters');

/**
 * Schema for nursing official's phone number
 */
export const nursingOfficialPhoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(CONTACT_PATTERNS.PHONE_US, 'Phone number must be 10 digits');

/**
 * Complete nursing official information schema
 */
export const nursingOfficialInformationSchema = z.object({
  firstName: nursingOfficialFirstNameSchema,
  lastName: nursingOfficialLastNameSchema,
  jobTitle: nursingOfficialJobTitleSchema,
  phoneNumber: nursingOfficialPhoneNumberSchema,
});
