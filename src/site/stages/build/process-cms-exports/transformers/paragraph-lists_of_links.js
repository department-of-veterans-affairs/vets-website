// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'lists_of_links',
  entity: {
    fieldSectionHeader: getDrupalValue(entity.fieldSectionHeader),
    fieldVaParagraphs: entity.fieldVaParagraphs || [],
  },
});

module.exports = {
  filter: ['field_section_header', 'field_va_paragraphs'],
  transform,
};
