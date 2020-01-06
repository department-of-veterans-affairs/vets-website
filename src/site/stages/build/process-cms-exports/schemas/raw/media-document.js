/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    path: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          alias: { type: ['string', 'null'] },
        },
        required: ['alias'],
      },
    },
  },
  required: ['name', 'path'],
};
