module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityBundle: { type: 'string' },
        fieldEmailAddress: { type: 'string' },
        fieldEmailLabel: { type: 'string' },
      },
    },
  },
};
