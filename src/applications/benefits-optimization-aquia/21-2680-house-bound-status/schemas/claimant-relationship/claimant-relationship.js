import { z } from 'zod';

/**
 * Schema for claimant relationship selection
 * Determines who the claim is for
 */
export const claimantRelationshipSchema = z.enum(
  ['veteran', 'spouse', 'child', 'parent'],
  {
    errorMap: () => ({ message: 'Please select who the claim is for' }),
  },
);

/**
 * Complete claimant relationship page schema
 */
export const claimantRelationshipPageSchema = z.object({
  relationship: claimantRelationshipSchema,
});
