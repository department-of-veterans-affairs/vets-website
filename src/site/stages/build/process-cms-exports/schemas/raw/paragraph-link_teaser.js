const { getFilter } = require('../../filters');

/* eslint-disable camelcase */
module.exports = {
  type: 'object',
  properties: {
    field_link: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        required: ['uri', 'title', 'options'],
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          options: { type: 'array' },
        },
      },
    },
    field_link_summary: {
      $ref: 'GenericNestedString',
    },
  },
  required: getFilter('paragraph-link_teaser'),
};
