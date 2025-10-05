import { z } from 'zod';
import { POSTAL_PATTERNS } from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for hospitalization status
 */
export const isCurrentlyHospitalizedSchema = z.enum(['yes', 'no'], {
  errorMap: () => ({ message: 'Please indicate hospitalization status' }),
});

/**
 * Schema for admission date
 */
export const admissionDateSchema = z
  .string()
  .refine(val => {
    if (!val) return true; // Optional when not hospitalized
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .optional();

/**
 * Schema for facility name
 */
export const facilityNameSchema = z
  .string()
  .min(1, 'Facility name is required')
  .max(100, 'Facility name must be less than 100 characters')
  .optional();

/**
 * Schema for facility address
 */
export const facilityStreetAddressSchema = z
  .string()
  .min(1, 'Street address is required')
  .max(50, 'Street address must be less than 50 characters')
  .optional();

export const facilityCitySchema = z
  .string()
  .min(1, 'City is required')
  .max(30, 'City must be less than 30 characters')
  .optional();

export const facilityStateSchema = z
  .string()
  .length(2, 'Please select a state')
  .optional();

export const facilityZipSchema = z
  .string()
  .refine(val => !val || POSTAL_PATTERNS.USA.test(val), {
    message: 'Please enter a valid 5 or 9 digit ZIP code',
  })
  .optional();

/**
 * Complete hospitalization schema with conditional validation
 */
export const hospitalizationSchema = z
  .object({
    isCurrentlyHospitalized: isCurrentlyHospitalizedSchema,
    admissionDate: admissionDateSchema,
    facilityName: facilityNameSchema,
    facilityStreetAddress: facilityStreetAddressSchema,
    facilityCity: facilityCitySchema,
    facilityState: facilityStateSchema,
    facilityZip: facilityZipSchema,
  })
  .refine(
    data => {
      if (data.isCurrentlyHospitalized === 'yes') {
        return !!(
          data.admissionDate &&
          data.facilityName &&
          data.facilityStreetAddress &&
          data.facilityCity &&
          data.facilityState &&
          data.facilityZip
        );
      }
      return true;
    },
    {
      message: 'Please provide complete facility information',
      path: ['facilityName'],
    },
  );
