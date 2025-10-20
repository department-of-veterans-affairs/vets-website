import { z } from 'zod';

/**
 * Burial information schemas for 21P-530a form
 * @module schemas/burial-information
 */

/**
 * Schema for date of burial
 */
export const dateOfBurialSchema = z
  .string()
  .min(1, 'Date of burial is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date');

/**
 * Schema for cemetery name
 */
export const cemeteryNameSchema = z
  .string()
  .min(1, 'Cemetery name is required')
  .max(100, 'Cemetery name must be less than 100 characters');

/**
 * Schema for cemetery location (city and state)
 */
export const cemeteryLocationSchema = z.object({
  city: z
    .string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .length(2, 'State must be a 2-letter code'),
});
