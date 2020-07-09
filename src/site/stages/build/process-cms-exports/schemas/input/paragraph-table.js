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
  required: ['field_table'],
};
