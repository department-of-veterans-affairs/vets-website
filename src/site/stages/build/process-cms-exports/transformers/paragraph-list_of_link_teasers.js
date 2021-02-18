const { getDrupalValue } = require('./helpers');

const transform = (entity, { parentFieldName }) => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'list_of_link_teasers',
    fieldTitle: getDrupalValue(entity.fieldTitle),
    fieldVaParagraphs: entity.fieldVaParagraphs || [],
    parentFieldName,
  },
});
module.exports = {
  filter: ['field_title', 'field_va_paragraphs'],
  transform,
};
