import { z } from 'zod';
import {
  POSTAL_PATTERNS,
  CONTACT_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Cemetery and organization information schemas for 21P-530a form
 * @module schemas/cemetery-information
 */

/**
 * Schema for organization claiming allowance
 */
export const organizationNameSchema = z
  .string()
  .min(1, 'Organization name is required')
  .max(100, 'Organization name must be less than 100 characters');

/**
 * Schema for cemetery name
 */
export const cemeteryNameSchema = z
  .string()
  .min(1, 'Cemetery name is required')
  .max(100, 'Cemetery name must be less than 100 characters');

/**
 * Schema for cemetery location
 */
export const cemeteryLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

/**
 * Schema for date of burial
 */
export const dateOfBurialSchema = z
  .string()
  .min(1, 'Date of burial is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    const today = new Date();
    return date <= today;
  }, 'Date of burial cannot be in the future');

/**
 * Schema for recipient organization name
 */
export const recipientNameSchema = z
  .string()
  .min(1, 'Recipient organization name is required')
  .max(100, 'Recipient name must be less than 100 characters');

/**
 * Schema for recipient phone number
 */
export const recipientPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(CONTACT_PATTERNS.PHONE_US, 'Phone number must be 10 digits');

/**
 * Schema for recipient address
 */
export const recipientAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  street3: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z
    .string()
    .min(1, 'Country is required')
    .default('USA'),
  postalCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(POSTAL_PATTERNS.USA, VALIDATION_MESSAGES.ZIP_USA),
  isMilitary: z.boolean().optional(),
});

/**
 * Complete cemetery information schema
 */
export const cemeteryInformationSchema = z.object({
  organizationName: organizationNameSchema,
  cemeteryName: cemeteryNameSchema,
  cemeteryLocation: cemeteryLocationSchema,
  dateOfBurial: dateOfBurialSchema,
  recipientOrganizationName: recipientNameSchema,
  recipientPhone: recipientPhoneSchema,
  recipientAddress: recipientAddressSchema,
});
