const { getFilter } = require('../../filters');

/* eslint-disable camelcase */
module.exports = {
  type: 'object',
  properties: {
    field_table: {
      type: 'array',
      maxItems: 1,
      items: { type: 'object' },
    },
  },
  required: getFilter('paragraph-table'),
};
