module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      $expand: 'true',
      required: ['fieldWysiwyg'],
      properties: {
        fieldWysiwyg: { $ref: 'ProcessedString' },
      },
    },
  },
  required: ['entity'],
};
