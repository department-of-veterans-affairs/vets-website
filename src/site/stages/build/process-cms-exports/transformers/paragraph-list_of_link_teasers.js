const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'list_of_link_teasers',
    fieldTitle: getDrupalValue(entity.fieldTitle),
    fieldVaParagraphs: getDrupalValue(entity.fieldVaParagraphs),
  },
});
module.exports = {
  filters: ['field_title', 'field_va_paragraphs'],
  transform,
};
