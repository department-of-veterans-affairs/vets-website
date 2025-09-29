import { z } from 'zod';

import {
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';
import { MEDICAID_PATTERNS, MEDICAID_MESSAGES } from './constants';

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
 * Schema for Medicaid number validation
 * Validates format according to Medicaid number patterns
 * @type {import('zod').ZodSchema}
 */
export const medicaidNumberSchema = z
  .string()
  .regex(MEDICAID_PATTERNS.MEDICAID_NUMBER, MEDICAID_MESSAGES.MEDICAID_NUMBER)
  .optional();

/**
 * Complete schema for nursing home details section
 * Combines facility name, address, admission date, and optional Medicaid number
 * @type {import('zod').ZodSchema}
 */
export const nursingHomeDetailsSchema = z.object({
  nursingHomeName: z.string().min(1, 'Nursing home name is required'),
  nursingHomeAddress: nursingHomeAddressSchema,
  admissionDate: admissionDateSchema,
  medicaidNumber: medicaidNumberSchema,
});

/**
 * Schema for type of care being provided
 * Enum of available care types in nursing facilities
 * @type {import('zod').ZodSchema}
 */
export const careTypeSchema = z.enum([
  'skilled',
  'intermediate',
  'domiciliary',
  'adult-day-health',
  'other',
]);

/**
 * Schema for payment and coverage information
 * Includes Medicaid coverage, monthly payments, and hospital transfer details
 * @type {import('zod').ZodSchema}
 */
export const paymentInfoSchema = z.object({
  medicaidCoverage: z.boolean(),
  medicaidNumber: medicaidNumberSchema,
  monthlyPayment: z
    .number()
    .min(0)
    .optional(),
  admissionFromHospital: z.boolean(),
  hospitalName: z.string().optional(),
  hospitalAdmissionDate: z.string().optional(),
});

/**
 * Schema for nursing care information section
 * Combines care type, nursing requirements, and payment details
 * @type {import('zod').ZodSchema}
 */
export const nursingCareInfoSchema = z.object({
  careType: careTypeSchema,
  requiresNursingCare: z.boolean(),
  nursingCareDetails: z.string().optional(),
  paymentInfo: paymentInfoSchema,
});
