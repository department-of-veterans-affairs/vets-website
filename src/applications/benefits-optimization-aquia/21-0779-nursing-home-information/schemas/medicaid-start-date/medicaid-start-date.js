import { z } from 'zod';

/**
 * Schema for medicaid start date
 * Validates date format and ensures date is not in the future
 */
export const medicaidStartDateSchema = z
  .string()
  .min(1, 'Medicaid start date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Medicaid start date cannot be in the future');

/**
 * Complete medicaid start date schema
 */
export const medicaidStartDateInfoSchema = z.object({
  medicaidStartDate: medicaidStartDateSchema,
});
