/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    uid: { $ref: 'GenericNestedNumber' },
    name: { $ref: 'GenericNestedString' },
    timezone: { $ref: 'GenericNestedString' },
  },
  required: ['uid', 'name', 'timezone'],
};
