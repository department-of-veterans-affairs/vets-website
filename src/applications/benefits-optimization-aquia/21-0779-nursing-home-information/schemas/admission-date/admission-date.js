import { z } from 'zod';

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
 * Complete admission date information schema
 */
export const admissionDateInfoSchema = z.object({
  admissionDate: admissionDateSchema,
});
