import { z } from 'zod';
import { fullNameSchema } from '@bio-aquia/shared/schemas/name';

/**
 * Schema for claimant's date of birth
 */
export const claimantDOBSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(val => {
    // Check format first
    if (!val || typeof val !== 'string') return false;

    const parts = val.split('-');
    if (parts.length !== 3) return true; // Let web component handle format errors

    const month = parseInt(parts[1], 10);

    // Check for invalid month specifically
    return month >= 1 && month <= 12;
  }, 'Please enter a month between 1 and 12')
  .refine(val => {
    // First check if it's a valid date
    const date = new Date(val);
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return false;
    }

    // Check if the date parts match the input (catches invalid dates like 2023-02-30)
    // Parse as UTC to avoid timezone issues
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      // Create a UTC date to compare
      const utcDate = new Date(Date.UTC(year, month - 1, day));

      // Check if the UTC date parts match the input
      return (
        utcDate.getUTCFullYear() === year &&
        utcDate.getUTCMonth() + 1 === month &&
        utcDate.getUTCDate() === day
      );
    }

    return true;
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    const today = new Date();
    return date <= today;
  }, 'Date of birth cannot be in the future');

/**
 * Page schema for claimant information page (name and DOB)
 */
export const claimantInformationPageSchema = z.object({
  claimantFullName: fullNameSchema,
  claimantDob: claimantDOBSchema,
});
