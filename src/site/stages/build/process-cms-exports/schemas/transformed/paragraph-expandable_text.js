/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg', 'fieldTextExpander'],
      properties: {
        fieldWysiwyg: { $ref: 'ProcessedString' },
        fieldTextExpander: { type: 'string' },
      },
    },
  },
};
