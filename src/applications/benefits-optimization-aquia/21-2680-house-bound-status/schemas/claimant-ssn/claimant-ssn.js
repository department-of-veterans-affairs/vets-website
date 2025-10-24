import { z } from 'zod';
import { ID_PATTERNS } from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for claimant's Social Security Number
 */
export const claimantSSNSchema = z
  .string()
  .min(1, 'Social Security Number is required')
  .transform(val => val?.replace(/-/g, ''))
  .refine(val => ID_PATTERNS.SSN.test(val), {
    message: 'SSN must be 9 digits',
  });

/**
 * Page schema for claimant SSN page
 */
export const claimantSSNPageSchema = z.object({
  claimantSSN: claimantSSNSchema,
});
