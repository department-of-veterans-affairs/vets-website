module.exports = {
  type: ['object', 'null'],
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['fieldSectionHeader', 'fieldStep'],
      properties: {
        fieldSectionHeader: { type: ['string', 'null'] },
        fieldStep: {
          type: ['array', 'null'],
          required: ['entity'],
          properties: {
            entity: { $ref: 'output/paragraph-step' },
          },
        },
      },
    },
  },
};
