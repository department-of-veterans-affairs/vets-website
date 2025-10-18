import { z } from 'zod';
import {
  NAME_PATTERNS,
  VALIDATION_MESSAGES,
  CONTACT_PATTERNS,
  POSTAL_PATTERNS,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for claimant's name fields
 */
export const claimantFirstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .max(30, 'First name must be less than 30 characters')
  .regex(NAME_PATTERNS.STANDARD, VALIDATION_MESSAGES.NAME_INVALID);

export const claimantMiddleNameSchema = z
  .string()
  .max(30, 'Middle name must be less than 30 characters')
  .regex(NAME_PATTERNS.OPTIONAL, VALIDATION_MESSAGES.NAME_INVALID)
  .optional()
  .or(z.literal(''));

export const claimantLastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(30, 'Last name must be less than 30 characters')
  .regex(NAME_PATTERNS.STANDARD, VALIDATION_MESSAGES.NAME_INVALID);

/**
 * Schema for claimant's address
 */
export const claimantStreetAddressSchema = z
  .string()
  .min(1, 'Street address is required')
  .max(50, 'Street address must be less than 50 characters');

export const claimantUnitNumberSchema = z
  .string()
  .max(10, 'Unit number must be less than 10 characters')
  .optional()
  .or(z.literal(''));

export const claimantCitySchema = z
  .string()
  .min(1, 'City is required')
  .max(30, 'City must be less than 30 characters');

export const claimantStateSchema = z
  .string()
  .length(2, 'Please select a state');

export const claimantZipSchema = z
  .string()
  .min(1, 'ZIP code is required')
  .refine(val => POSTAL_PATTERNS.USA.test(val), {
    message: 'Please enter a valid 5 or 9 digit ZIP code',
  });

/**
 * Schema for claimant's phone
 */
export const claimantPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(val => CONTACT_PATTERNS.PHONE_US.test(val.replace(/\D/g, '')), {
    message: 'Please enter a valid 10-digit phone number',
  });

/**
 * Schema for relationship to veteran
 */
export const claimantRelationshipSchema = z.enum(
  ['spouse', 'child', 'parent', 'guardian', 'fiduciary', 'other'],
  {
    errorMap: () => ({
      message: 'Please select your relationship to the Veteran',
    }),
  },
);

export const claimantRelationshipOtherSchema = z
  .string()
  .min(1, 'Please specify your relationship')
  .max(50, 'Relationship description must be less than 50 characters');

/**
 * Complete claimant identification schema
 */
export const claimantIdentificationSchema = z
  .object({
    claimantFirstName: claimantFirstNameSchema,
    claimantMiddleName: claimantMiddleNameSchema,
    claimantLastName: claimantLastNameSchema,
    claimantStreetAddress: claimantStreetAddressSchema,
    claimantUnitNumber: claimantUnitNumberSchema,
    claimantCity: claimantCitySchema,
    claimantState: claimantStateSchema,
    claimantZip: claimantZipSchema,
    claimantPhone: claimantPhoneSchema,
    claimantRelationship: claimantRelationshipSchema,
    claimantRelationshipOther: z.string().optional(),
  })
  .refine(
    data => {
      if (data.claimantRelationship === 'other') {
        return (
          data.claimantRelationshipOther &&
          data.claimantRelationshipOther.length > 0
        );
      }
      return true;
    },
    {
      message: 'Please specify your relationship',
      path: ['claimantRelationshipOther'],
    },
  );
