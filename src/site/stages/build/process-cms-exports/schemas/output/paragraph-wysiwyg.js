module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg'],
      properties: {
        fieldWysiwyg: {
          oneOf: [{ $ref: 'ProcessedString' }, { type: 'null' }],
        },
      },
    },
  },
  required: ['entity'],
};
