/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    uri: { $ref: 'GenericNestedString' },
    filename: { $ref: 'GenericNestedString' },
  },
  required: ['uri', 'filename'],
};
