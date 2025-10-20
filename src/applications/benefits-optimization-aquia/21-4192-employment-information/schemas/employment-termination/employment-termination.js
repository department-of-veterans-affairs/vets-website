import { z } from 'zod';

/**
 * Employment termination schema for 21-4192 form
 * @module schemas/employment-termination
 */

/**
 * Schema for termination reason
 */
export const terminationReasonSchema = z
  .string()
  .max(1000, 'Termination reason must be less than 1000 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for date last worked
 */
export const dateLastWorkedSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    val => {
      if (!val) return true;
      const date = new Date(val);
      return date instanceof Date && !Number.isNaN(date.getTime());
    },
    { message: 'Please enter a valid date' },
  )
  .refine(
    val => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    },
    { message: 'Date last worked cannot be in the future' },
  );

/**
 * Complete employment termination schema
 */
export const employmentTerminationSchema = z.object({
  terminationReason: terminationReasonSchema,
  dateLastWorked: dateLastWorkedSchema,
});
