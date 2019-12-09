const { getFilter } = require('../../filters');

/* eslint-disable camelcase */
module.exports = {
  type: 'object',
  properties: {
    field_steps: {
      type: 'array',
      items: {
        type: 'object',
        required: ['value'],
      },
    },
  },
  required: getFilter('paragraph-process'),
};
