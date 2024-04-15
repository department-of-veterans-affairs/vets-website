export const uiSchema = {
  application: {
    'ui:title': 'Applicant Mailing Address Placeholder',
    veteran: {},
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
