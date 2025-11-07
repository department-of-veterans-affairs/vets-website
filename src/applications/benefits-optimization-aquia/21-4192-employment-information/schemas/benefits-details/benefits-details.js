import { z } from 'zod';

/**
 * Benefits details schemas for 21-4192 form
 * @module schemas/benefits-details
 */

/**
 * Schema for benefit type text
 */
export const benefitTypeSchema = z
  .string()
  .max(500, 'Benefit type must be less than 500 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for gross monthly amount
 */
export const grossMonthlyAmountSchema = z
  .string()
  .max(50, 'Amount must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for start receiving date
 */
export const startReceivingDateSchema = z
  .string()
  .min(1, 'Start receiving date is required')
  .refine(
    val => {
      if (!val) return false;
      const date = new Date(val);
      return date instanceof Date && !Number.isNaN(date.getTime());
    },
    { message: 'Please enter a valid date' },
  );

/**
 * Schema for first payment date
 */
export const firstPaymentDateSchema = z
  .string()
  .min(1, 'First payment date is required')
  .refine(
    val => {
      if (!val) return false;
      const date = new Date(val);
      return date instanceof Date && !Number.isNaN(date.getTime());
    },
    { message: 'Please enter a valid date' },
  );

/**
 * Schema for stop receiving date
 */
export const stopReceivingDateSchema = z
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
 * Complete benefits details schema
 */
export const benefitsDetailsSchema = z.object({
  benefitType: benefitTypeSchema,
  grossMonthlyAmount: grossMonthlyAmountSchema,
  startReceivingDate: startReceivingDateSchema,
  firstPaymentDate: firstPaymentDateSchema,
  stopReceivingDate: stopReceivingDateSchema,
});
