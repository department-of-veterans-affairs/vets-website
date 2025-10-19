import { z } from 'zod';

/**
 * Organization information schemas for 21P-530a form
 * @module schemas/organization-information
 */

/**
 * Schema for organization name
 */
export const organizationNameSchema = z
  .string()
  .min(1, 'Organization name is required')
  .max(100, 'Organization name must be less than 100 characters');

/**
 * Schema for recipient organization name
 */
export const recipientNameSchema = z
  .string()
  .min(1, 'Recipient name is required')
  .max(100, 'Recipient name must be less than 100 characters');

/**
 * Schema for recipient phone number
 */
export const recipientPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^\d{10}$/,
    'Phone number must be 10 digits (no spaces or special characters)',
  );

/**
 * Schema for recipient mailing address
 */
export const recipientAddressSchema = z.object({
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
