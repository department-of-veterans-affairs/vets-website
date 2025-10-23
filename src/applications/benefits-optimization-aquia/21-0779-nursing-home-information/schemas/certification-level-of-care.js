import { z } from 'zod';

/**
 * Schema for certification level of care
 */
export const certificationLevelOfCareSchema = z.object({
  levelOfCare: z.enum(['skilled', 'intermediate'], {
    errorMap: (issue, ctx) => {
      if (
        issue.code === 'invalid_enum_value' ||
        issue.code === 'invalid_type'
      ) {
        return { message: 'Please select the level of care being provided' };
      }
      return { message: ctx.defaultError };
    },
  }),
});
