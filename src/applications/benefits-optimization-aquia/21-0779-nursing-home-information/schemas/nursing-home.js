import { z } from 'zod';

import {
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';
import { MEDICAID_PATTERNS, MEDICAID_MESSAGES } from './constants';

/**
 * Nursing home information schemas for 21-0779 form
 */

// Nursing home address (similar to address but for facility)
export const nursingHomeAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z
    .string()
    .regex(POSTAL_PATTERNS.USA, VALIDATION_MESSAGES.ZIP_USA),
});

// Admission date schema
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

// Medicaid number schema
export const medicaidNumberSchema = z
  .string()
  .regex(MEDICAID_PATTERNS.MEDICAID_NUMBER, MEDICAID_MESSAGES.MEDICAID_NUMBER)
  .optional();

// Nursing home details schema
export const nursingHomeDetailsSchema = z.object({
  nursingHomeName: z.string().min(1, 'Nursing home name is required'),
  nursingHomeAddress: nursingHomeAddressSchema,
  admissionDate: admissionDateSchema,
  medicaidNumber: medicaidNumberSchema,
});

// Care type enum
export const careTypeSchema = z.enum([
  'skilled',
  'intermediate',
  'domiciliary',
  'adult-day-health',
  'other',
]);

// Payment information schema
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

// Nursing care information schema
export const nursingCareInfoSchema = z.object({
  careType: careTypeSchema,
  requiresNursingCare: z.boolean(),
  nursingCareDetails: z.string().optional(),
  paymentInfo: paymentInfoSchema,
});
