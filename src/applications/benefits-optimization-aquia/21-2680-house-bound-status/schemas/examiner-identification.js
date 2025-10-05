import { z } from 'zod';
import {
  CONTACT_PATTERNS,
  POSTAL_PATTERNS,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for examiner name
 */
export const examinerNameSchema = z
  .string()
  .min(1, 'Examiner name is required')
  .max(50, 'Name must be less than 50 characters');

/**
 * Schema for examiner title/credentials
 */
export const examinerTitleSchema = z.enum(
  ['md', 'do', 'pa', 'aprn', 'np', 'cns'],
  {
    errorMap: () => ({ message: 'Please select professional title' }),
  },
);

/**
 * Schema for NPI number
 */
export const examinerNPISchema = z
  .string()
  .min(1, 'NPI number is required')
  .refine(val => /^\d{10}$/.test(val.replace(/\D/g, '')), {
    message: 'NPI must be exactly 10 digits',
  });

/**
 * Schema for examiner phone
 */
export const examinerPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(val => CONTACT_PATTERNS.PHONE_US.test(val.replace(/\D/g, '')), {
    message: 'Please enter a valid 10-digit phone number',
  });

/**
 * Schema for facility/practice name
 */
export const facilityPracticeNameSchema = z
  .string()
  .min(1, 'Facility/Practice name is required')
  .max(100, 'Name must be less than 100 characters');

/**
 * Schema for examiner address
 */
export const examinerStreetAddressSchema = z
  .string()
  .min(1, 'Street address is required')
  .max(50, 'Street address must be less than 50 characters');

export const examinerUnitNumberSchema = z
  .string()
  .max(10, 'Unit number must be less than 10 characters')
  .optional()
  .or(z.literal(''));

export const examinerCitySchema = z
  .string()
  .min(1, 'City is required')
  .max(30, 'City must be less than 30 characters');

export const examinerStateSchema = z
  .string()
  .length(2, 'Please select a state');

export const examinerZipSchema = z
  .string()
  .min(1, 'ZIP code is required')
  .refine(val => POSTAL_PATTERNS.USA.test(val), {
    message: 'Please enter a valid 5 or 9 digit ZIP code',
  });

/**
 * Complete examiner identification schema
 */
export const examinerIdentificationSchema = z.object({
  examinerName: examinerNameSchema,
  examinerTitle: examinerTitleSchema,
  examinerNPI: examinerNPISchema,
  examinerPhone: examinerPhoneSchema,
  facilityPracticeName: facilityPracticeNameSchema,
  examinerStreetAddress: examinerStreetAddressSchema,
  examinerUnitNumber: examinerUnitNumberSchema,
  examinerCity: examinerCitySchema,
  examinerState: examinerStateSchema,
  examinerZip: examinerZipSchema,
});
