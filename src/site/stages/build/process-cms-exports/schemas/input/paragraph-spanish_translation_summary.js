/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_text_expander: { $ref: 'GenericNestedString' },
    field_wysiwyg: { $ref: 'GenericNestedString' },
  },
  required: ['field_text_expander', 'field_wysiwyg'],
};
