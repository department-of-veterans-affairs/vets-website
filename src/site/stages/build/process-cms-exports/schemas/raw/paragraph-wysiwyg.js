const { getFilter } = require('../../filters');

/* eslint-disable camelcase */
module.exports = {
  type: 'object',
  properties: {
    field_wysiwyg: {
      type: 'array',
      properties: {
        value: { type: 'string' },
        format: { type: 'string' },
      },
    },
  },
  required: getFilter('paragraph-wysiwyg'),
};
