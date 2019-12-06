module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        fieldTitle: { type: 'string' },
        fieldVaParagraphs: { type: 'array' },
      },
      required: ['fieldTitle', 'fieldVaParagraphs'],
    },
  },
  required: ['entity'],
};
