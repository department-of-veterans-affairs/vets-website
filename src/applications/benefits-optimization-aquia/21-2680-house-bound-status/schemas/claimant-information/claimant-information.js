import { z } from 'zod';
import { fullNameSchema } from '@bio-aquia/shared/schemas/name';

/**
 * Schema for claimant's date of birth
 */
export const claimantDOBSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Date of birth cannot be in the future');

/**
 * Page schema for claimant information page (name and DOB)
 */
export const claimantInformationPageSchema = z.object({
  claimantFullName: fullNameSchema,
  claimantDOB: claimantDOBSchema,
});
