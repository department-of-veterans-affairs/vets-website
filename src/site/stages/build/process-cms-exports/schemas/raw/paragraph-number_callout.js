/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_short_phrase_with_a_number: { $ref: 'GenericNestedString' },
    field_wysiwyg: { $ref: 'GenericNestedString' },
  },
  required: ['field_short_phrase_with_a_number', 'field_wysiwyg'],
};
