/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    uri: { $ref: 'GenericNestedString' },
  },
  required: ['uri'],
};
