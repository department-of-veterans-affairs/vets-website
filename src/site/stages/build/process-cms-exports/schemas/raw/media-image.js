/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    image: { $ref: 'GenericNestedString' },
  },
  required: ['image'],
};
