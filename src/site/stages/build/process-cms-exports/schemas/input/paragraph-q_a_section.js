/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_accordion_display: { $ref: 'GenericNestedBoolean' },
    field_questions: { $ref: 'EntityReferenceArray' },
    field_section_header: { $ref: 'GenericNestedString' },
    field_section_intro: { $ref: 'GenericNestedString' },
  },
  required: [
    'field_accordion_display',
    'field_questions',
    'field_section_header',
    'field_section_intro',
  ],
};
