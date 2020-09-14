/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_title: { $ref: 'GenericNestedString' },
    field_va_paragraphs: { $ref: 'EntityReferenceArray' },
  },
  required: ['field_title', 'field_va_paragraphs'],
};
