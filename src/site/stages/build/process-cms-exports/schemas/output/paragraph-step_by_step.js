module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        fieldSectionHeader: { type: 'string' },
        fieldStep: {
          type: ['array', 'null'],
          properties: {
            entity: { $ref: 'output/paragraph-step' },
          },
        },
      },
    },
  },
};
