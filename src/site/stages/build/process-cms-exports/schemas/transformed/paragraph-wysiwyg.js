module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg'],
      properties: {
        fieldWysiwyg: { $ref: 'ProcessedString' },
      },
    },
  },
  required: ['entity'],
};
