/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    path: { $ref: 'GenericNestedString' },
  },
  required: ['name', 'path'],
};
