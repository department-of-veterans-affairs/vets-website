/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_table: { $ref: 'GenericNestedString' },
  },
  required: ['field_table'],
};
