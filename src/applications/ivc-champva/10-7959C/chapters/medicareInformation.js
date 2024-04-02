import { applicantListSchema } from '../config/constants';

export const blankSchema = { type: 'object', properties: {} };

// Used with a custom page
export const applicantHasMedicareABSchema = {
  uiSchema: {
    applicants: { items: {} },
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

export const applicantMedicareABContextSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicareStatusContinued: {
      type: 'object',
      properties: {
        medicareContext: { type: 'string' },
        otherMedicareContext: { type: 'string' },
      },
    },
  }),
};
