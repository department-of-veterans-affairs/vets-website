/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg', 'fieldTitle'],
      properties: {
        fieldWysiwyg: { $ref: 'ProcessedString' },
        fieldTitle: { type: 'string' },
      },
    },
  },
};
