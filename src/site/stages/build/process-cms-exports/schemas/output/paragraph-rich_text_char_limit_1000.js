module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        fieldWysiwyg: { $ref: 'ProcessedString' },
      },
      required: ['fieldWysiwyg'],
    },
  },
};
