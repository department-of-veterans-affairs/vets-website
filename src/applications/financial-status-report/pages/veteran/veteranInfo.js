export const uiSchema = {};

export const schema = {
  type: 'object',
  properties: {
    'view:components': {
      type: 'object',
      properties: {
        'view:veteranInfo': {
          type: 'object',
          properties: {
            veteranFullName: {
              type: 'string',
            },
            ssnLastFour: {
              type: 'string',
            },
            dob: {
              type: 'string',
            },
            fileNumber: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
