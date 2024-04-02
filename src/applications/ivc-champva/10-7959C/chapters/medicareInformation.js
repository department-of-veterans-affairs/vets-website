import { applicantListSchema } from '../config/constants';

export const blankSchema = { type: 'object', properties: {} };

// Used with a custom page
export const applicantHasMedicareABSchema = {
  uiSchema: {
    applicants: {
      items: {},
    },
  },
  schema: applicantListSchema([], {
    applicantMedicareStatus: {
      type: 'object',
      properties: {
        enrollment: { type: 'string' },
        otherEnrollment: { type: 'string' },
      },
    },
  }),
};
