/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_email_address: { $ref: 'GenericNestedString' },
    field_email_label: { $ref: 'GenericNestedString' },
  },
  required: ['field_email_address', 'field_email_label'],
};
