/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg', 'fieldTextExpander'],
      properties: {
        fieldWysiwyg: {
          type: 'object',
          properties: { processed: { type: 'string' } },
        },
        fieldTextExpander: { type: 'string' },
      },
    },
  },
};
