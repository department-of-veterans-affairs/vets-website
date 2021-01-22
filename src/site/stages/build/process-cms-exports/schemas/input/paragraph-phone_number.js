/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_phone_extension: { $ref: 'GenericNestedString' },
    field_phone_label: { $ref: 'GenericNestedString' },
    field_phone_number: { $ref: 'GenericNestedString' },
    field_phone_number_type: { $ref: 'GenericNestedString' },
  },
  required: ['field_phone_number'],
};
