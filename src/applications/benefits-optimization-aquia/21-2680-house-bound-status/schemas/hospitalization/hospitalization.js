import { z } from 'zod';

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
  .optional()
  .or(z.literal(''));

/**
 * Schema for facility name
 */
export const facilityNameSchema = z
  .string()
  .max(100, 'Facility name must be less than 100 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for facility address (follows AddressField component structure)
 */
export const facilityAddressSchema = z.object({
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(50, 'Street address must be less than 50 characters'),
  street2: z
    .string()
    .max(50, 'Street address line 2 must be less than 50 characters')
    .optional(),
  street3: z
    .string()
    .max(50, 'Street address line 3 must be less than 50 characters')
    .optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .length(2, 'State must be a 2-letter code'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(
      /^\d{5}(-\d{4})?$/,
      'Postal code must be in format 12345 or 12345-6789',
    ),
  isMilitary: z.boolean().optional(),
});

/**
 * Page schemas for split hospitalization flow
 */
export const hospitalizationStatusPageSchema = z.object({
  isCurrentlyHospitalized: isCurrentlyHospitalizedSchema,
});

export const hospitalizationDatePageSchema = z.object({
  admissionDate: z.string().min(1, 'Please enter the admission date'),
});

export const hospitalizationFacilityPageSchema = z.object({
  facilityName: z
    .string()
    .min(1, 'Please enter the name of the hospital')
    .max(100, 'Facility name must be less than 100 characters'),
  facilityAddress: facilityAddressSchema,
});

/**
 * Complete hospitalization schema with conditional validation
 */
export const hospitalizationSchema = z
  .object({
    isCurrentlyHospitalized: isCurrentlyHospitalizedSchema,
    admissionDate: admissionDateSchema,
    facilityName: facilityNameSchema,
    facilityAddress: facilityAddressSchema.optional(),
  })
  .refine(
    data => {
      if (data.isCurrentlyHospitalized === 'yes') {
        return !!(
          data.admissionDate &&
          data.facilityName &&
          data.facilityAddress?.street &&
          data.facilityAddress?.city &&
          data.facilityAddress?.state &&
          data.facilityAddress?.postalCode
        );
      }
      return true;
    },
    {
      message: 'Please provide complete facility information',
      path: ['facilityName'],
    },
  );
