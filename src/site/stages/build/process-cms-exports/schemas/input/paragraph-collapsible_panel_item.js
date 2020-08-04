/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_title: { $ref: 'GenericNestedString' },
    field_va_paragraphs: { $ref: 'EntityReferenceArray' },
    field_wysiwyg: { $ref: 'GenericNestedString' },
  },
  required: ['field_title', 'field_va_paragraphs', 'field_wysiwyg'],
};
