/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    path: {
      type: 'array',
      items: {
        type: 'object',
        required: ['alias'],
        properties: {
          alias: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['name', 'path'],
};
