import { z } from 'zod';
import {
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Employer information schemas for 21-4192 form
 * @module schemas/employer-information
 */

/**
 * Schema for employer name
 */
export const employerNameSchema = z
  .string()
  .min(1, 'Employer name is required')
  .max(100, 'Employer name must be less than 100 characters');

/**
 * Schema for employer address
 */
export const employerAddressSchema = z.object({
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
 * Complete employer information schema for 21-4192
 */
export const employerInformationSchema = z.object({
  employerName: employerNameSchema,
  employerAddress: employerAddressSchema,
});
