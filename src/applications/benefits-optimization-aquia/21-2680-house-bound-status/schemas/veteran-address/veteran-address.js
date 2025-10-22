import { z } from 'zod';

/**
 * Schema for veteran's mailing address
 */
export const veteranAddressSchema = z.object({
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
 * Page schema for veteran address page
 */
export const veteranAddressPageSchema = z.object({
  veteranAddress: veteranAddressSchema,
});
