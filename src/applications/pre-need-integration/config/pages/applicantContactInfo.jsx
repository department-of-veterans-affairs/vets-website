export const uiSchema = {
  application: {
    applicant: {
      placeholder: {
        'ui:title': 'Placeholder',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          properties: {
            placeholder: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
