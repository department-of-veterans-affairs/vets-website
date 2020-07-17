/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    // field_wysiwyg also has a `format` that we don't use
    field_wysiwyg: { $ref: 'GenericNestedString' },
    field_text_expander: { $ref: 'GenericNestedString' },
  },
};
