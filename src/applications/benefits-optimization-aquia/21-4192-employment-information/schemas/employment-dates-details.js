import { z } from 'zod';

/**
 * Employment dates and details schemas for 21-4192 form
 * @module schemas/employment-dates-details
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
 * Schema for type of work performed
 */
export const typeOfWorkSchema = z
  .string()
  .max(1000, 'Type of work must be less than 1000 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for amount earned
 */
export const amountEarnedSchema = z
  .string()
  .max(100, 'Amount earned must be less than 100 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for time lost
 */
export const timeLostSchema = z
  .string()
  .max(100, 'Time lost must be less than 100 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for daily hours
 */
export const dailyHoursSchema = z
  .string()
  .max(50, 'Daily hours must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for weekly hours
 */
export const weeklyHoursSchema = z
  .string()
  .max(50, 'Weekly hours must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Complete employment dates and details schema
 */
export const employmentDatesDetailsSchema = z.object({
  beginningDate: beginningDateSchema,
  endingDate: endingDateSchema,
  typeOfWork: typeOfWorkSchema,
  amountEarned: amountEarnedSchema,
  timeLost: timeLostSchema,
  dailyHours: dailyHoursSchema,
  weeklyHours: weeklyHoursSchema,
});
