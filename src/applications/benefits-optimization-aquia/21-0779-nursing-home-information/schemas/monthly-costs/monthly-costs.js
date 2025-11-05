import { z } from 'zod';

/**
 * Schema for monthly out-of-pocket amount
 */
export const monthlyOutOfPocketSchema = z
  .string()
  .min(1, 'Monthly out-of-pocket amount is required')
  .refine(val => {
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return !Number.isNaN(num) && num >= 0;
  }, 'Please enter a valid dollar amount');

/**
 * Complete monthly costs schema
 */
export const monthlyCostsSchema = z.object({
  monthlyOutOfPocket: monthlyOutOfPocketSchema,
});
