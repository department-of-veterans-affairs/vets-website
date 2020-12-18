/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_section_header: { $ref: 'GenericNestedString' },
    field_step: { $ref: 'EntityReferenceArray' },
  },
  required: ['field_section_header', 'field_step'],
};
