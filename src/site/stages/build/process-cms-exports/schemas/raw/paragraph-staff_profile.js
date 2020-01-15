/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_staff_profile: { $ref: 'GenericNestedString' },
  },
  required: ['field_staff_profile'],
};
