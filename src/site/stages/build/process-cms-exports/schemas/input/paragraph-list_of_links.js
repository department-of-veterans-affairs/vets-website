/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_section_header: { $ref: 'GenericNestedString' },
    field_links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
        },
      },
    },
    field_link: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
        },
      },
    },
  },
  required: ['field_section_header', 'field_links', 'field_link'],
};
