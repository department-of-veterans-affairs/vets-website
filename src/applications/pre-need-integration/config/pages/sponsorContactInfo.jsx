export const uiSchema = {
  application: {
    applicant: {
      placeholder: {
        'ui:title': 'PLACEHOLDER',
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
