module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldSteps'],
      properties: {
        fieldSteps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              processed: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};
