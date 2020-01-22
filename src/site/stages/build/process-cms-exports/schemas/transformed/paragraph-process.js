module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldSteps'],
      properties: {
        fieldSteps: {
          type: 'array',
          items: { $ref: 'ProcessedString' },
        },
      },
    },
  },
  required: ['entity'],
};
