import { z } from 'zod';

/**
 * Employment dates schemas for 21-4192 form
 * @module schemas/employment-dates
 */

/**
 * Schema for beginning date of employment
 */
export const beginningDateSchema = z
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
  );

/**
 * Schema for ending date of employment
 */
export const endingDateSchema = z
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
  );

/**
 * Schema for currently employed status
 */
export const currentlyEmployedSchema = z.boolean().optional();

/**
 * Complete employment dates schema
 */
export const employmentDatesSchema = z.object({
  beginningDate: beginningDateSchema,
  endingDate: endingDateSchema,
  currentlyEmployed: currentlyEmployedSchema,
});
