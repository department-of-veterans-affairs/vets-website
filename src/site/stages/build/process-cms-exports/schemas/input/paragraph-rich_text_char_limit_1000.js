/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  require: ['field_wysiwyg'],
  properties: {
    field_wysiwyg: {
      type: 'array',
      items: {
        type: 'object',
        required: ['processed'],
        properties: {
          processed: {
            type: 'string',
          },
        },
      },
    },
  },
};
