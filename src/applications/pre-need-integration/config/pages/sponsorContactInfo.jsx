// Below is placeholder code which will be updated in MBMS-54141

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
