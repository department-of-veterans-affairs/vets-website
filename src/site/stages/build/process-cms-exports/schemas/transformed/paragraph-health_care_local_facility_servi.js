/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['fieldWysiwyg', 'fieldTitle'],
      properties: {
        fieldWysiwyg: {
          type: 'object',
          properties: { processed: { type: 'string' } },
        },
        fieldTitle: { type: 'string' },
      },
    },
  },
};
