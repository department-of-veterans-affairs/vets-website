import { z } from 'zod';

/**
 * Relationship to veteran schemas for 21P-530a form
 * @module schemas/relationship-to-veteran
 */

/**
 * Schema for relationship to veteran
 * Validates whether the applicant is from a state cemetery or tribal organization
 */
export const relationshipToVeteranSchema = z.enum(
  ['state_cemetery', 'tribal_organization'],
  {
    errorMap: (issue, ctx) => {
      if (
        issue.code === 'invalid_enum_value' ||
        issue.code === 'invalid_type'
      ) {
        return {
          message: 'Please select your organization type',
        };
      }
      return { message: ctx.defaultError };
    },
  },
);
