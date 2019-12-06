module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        fieldTitle: { type: 'string' },
        fieldVaParagraphs: { type: 'string' },
      },
      required: ['fieldTitle', 'fieldVaParagraphs'],
    },
  },
  required: ['entity'],
};
