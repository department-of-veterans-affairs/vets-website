import { z } from 'zod';

/**
 * Employment concessions schema for 21-4192 form
 * @module schemas/employment-concessions
 */

/**
 * Schema for concessions made to employee
 */
export const concessionsSchema = z
  .string()
  .max(1000, 'Concessions must be less than 1000 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete employment concessions schema
 */
export const employmentConcessionsSchema = z.object({
  concessions: concessionsSchema,
});
