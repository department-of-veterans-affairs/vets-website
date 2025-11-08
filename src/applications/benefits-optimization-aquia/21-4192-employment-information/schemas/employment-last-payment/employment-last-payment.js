import { z } from 'zod';

/**
 * Employment last payment schema for 21-4192 form
 * @module schemas/employment-last-payment
 */

/**
 * Schema for date of last payment
 */
export const dateOfLastPaymentSchema = z
  .string()
  .min(1, 'Date of last payment is required')
  .refine(
    val => {
      if (!val) return false;
      const date = new Date(val);
      return date instanceof Date && !Number.isNaN(date.getTime());
    },
    { message: 'Please enter a valid date' },
  );

/**
 * Schema for gross amount of last payment
 */
export const grossAmountLastPaymentSchema = z
  .string()
  .max(50, 'Amount must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for lump sum payment question
 */
export const lumpSumPaymentSchema = z
  .enum(['yes', 'no', ''])
  .optional()
  .or(z.literal(''));

/**
 * Schema for gross amount paid
 */
export const grossAmountPaidSchema = z
  .string()
  .max(50, 'Amount must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for date paid
 */
export const datePaidSchema = z
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
 * Complete employment last payment schema
 */
export const employmentLastPaymentSchema = z
  .object({
    dateOfLastPayment: dateOfLastPaymentSchema,
    grossAmountLastPayment: grossAmountLastPaymentSchema,
    lumpSumPayment: lumpSumPaymentSchema,
    grossAmountPaid: grossAmountPaidSchema,
    datePaid: datePaidSchema,
  })
  .refine(
    data => {
      // If lump sum payment is yes, gross amount paid and date paid are required
      if (data.lumpSumPayment === 'yes') {
        return data.grossAmountPaid && data.grossAmountPaid.trim() !== '';
      }
      return true;
    },
    {
      message: 'Gross amount paid is required when lump sum payment was made',
      path: ['grossAmountPaid'],
    },
  )
  .refine(
    data => {
      // If lump sum payment is yes, date paid is required
      if (data.lumpSumPayment === 'yes') {
        return data.datePaid && data.datePaid.trim() !== '';
      }
      return true;
    },
    {
      message: 'Date lump sum was paid is required',
      path: ['datePaid'],
    },
  );
