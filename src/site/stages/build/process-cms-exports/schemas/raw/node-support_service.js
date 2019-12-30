/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    field_link: { $ref: 'GenericNestedString' },
    field_phone_number: { $ref: 'GenericNestedString' },
  },
  required: ['title', 'field_link', 'field_phone_number'],
};
