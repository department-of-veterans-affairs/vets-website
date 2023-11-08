export const uiSchema = {};
export const schema = {
  type: 'object',
  properties: {
    additionalData: {
      type: 'object',
      properties: {
        bankruptcy: {
          type: 'object',
          properties: {
            dateDischarged: {
              type: 'string',
            },
            courtLocation: {
              type: 'string',
            },
            docketNumber: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
