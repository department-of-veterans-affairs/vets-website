import { z } from 'zod';
import {
  CONTACT_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Contact information schemas for 21-0779 form
 */

// Phone number schema
export const phoneSchema = z
  .string()
  .regex(CONTACT_PATTERNS.PHONE_US, VALIDATION_MESSAGES.PHONE_FORMAT)
  .optional();

// Email schema
export const emailSchema = z
  .string()
  .email(VALIDATION_MESSAGES.EMAIL_FORMAT)
  .optional();

// ZIP code schema
export const zipCodeSchema = z
  .string()
  .regex(CONTACT_PATTERNS.ZIP_CODE, VALIDATION_MESSAGES.ZIP_USA);

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: zipCodeSchema,
  country: z.string().default('USA'),
});

// Mailing address schema (can be optional)
export const mailingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: zipCodeSchema,
});

// Contact info schema
export const contactInfoSchema = z.object({
  phone: phoneSchema,
  email: emailSchema,
  mailingAddress: mailingAddressSchema,
});
