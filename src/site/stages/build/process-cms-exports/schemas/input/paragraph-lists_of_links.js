/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_section_header: { $ref: 'GenericNestedString' },
    field_va_paragraphs: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
  },
  required: ['field_section_header', 'field_va_paragraphs'],
};
