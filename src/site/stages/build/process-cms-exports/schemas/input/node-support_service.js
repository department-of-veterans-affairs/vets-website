/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    field_link: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          options: { type: 'array' },
        },
        required: ['uri', 'title', 'options'],
      },
    },
    field_phone_number: { $ref: 'GenericNestedString' },
  },
  required: ['title', 'field_link', 'field_phone_number'],
};
