/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_alert: {
      type: 'array',
      items: {
        $ref: 'EntityReference',
      },
    },
    field_media: {
      type: 'array',
      items: {
        $ref: 'EntityReference',
      },
    },
    field_wysiwyg: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          processed: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['field_alert', 'field_wysiwyg', 'field_media'],
};
