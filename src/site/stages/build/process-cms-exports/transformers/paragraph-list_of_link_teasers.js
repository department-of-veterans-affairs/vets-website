const { getDrupalValue, getRawParentFieldName } = require('./helpers');

const transform = (entity, uuid, ancestors) => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'list_of_link_teasers',
    fieldTitle: getDrupalValue(entity.fieldTitle),
    fieldVaParagraphs: entity.fieldVaParagraphs,
    parentFieldName: ancestors.length
      ? getRawParentFieldName(ancestors[ancestors.length - 1].entity, uuid)
      : // The entity in the unit test won't have any parents
        '',
  },
});
module.exports = {
  filter: ['field_title', 'field_va_paragraphs'],
  transform,
};
