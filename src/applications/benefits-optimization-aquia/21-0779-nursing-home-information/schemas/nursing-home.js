import { z } from 'zod';

import {
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Nursing home information schemas for 21-0779 form
 * @module schemas/nursing-home
 */

/**
 * Schema for nursing home facility address
 * Validates US addresses with required street, city, state, and postal code
 * @type {import('zod').ZodSchema}
 */
export const nursingHomeAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z
    .string()
    .regex(POSTAL_PATTERNS.USA, VALIDATION_MESSAGES.ZIP_USA),
});

/**
 * Schema for nursing home admission date
 * Validates date format and ensures date is not in the future
 * @type {import('zod').ZodSchema}
 */
export const admissionDateSchema = z
  .string()
  .min(1, 'Admission date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Admission date cannot be in the future');

/**
 * Complete schema for nursing home details section
 * Includes facility name, address, and admission date
 * @type {import('zod').ZodSchema}
 */
export const nursingHomeDetailsSchema = z.object({
  nursingHomeName: z.string().min(1, 'Nursing home name is required'),
  nursingHomeAddress: nursingHomeAddressSchema,
  admissionDate: admissionDateSchema,
});
