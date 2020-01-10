/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    path: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
        },
        required: ['alias'],
      },
    },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
  },
  required: ['title', 'path', 'field_nickname_for_this_facility'],
};
