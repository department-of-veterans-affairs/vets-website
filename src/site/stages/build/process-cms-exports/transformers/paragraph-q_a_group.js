// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'q_a_group',
    fieldSectionHeader: entity.fieldSectionHeader?.[0]?.value || null,
    fieldAccordionDisplay: entity.fieldAccordionDisplay?.[0]?.value,
    fieldQAs: entity.fieldQAs,
  },
});

module.exports = {
  filter: ['field_section_header', 'field_accordion_display', 'field_q_as'],
  transform,
};
