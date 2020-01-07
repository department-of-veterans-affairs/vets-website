const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'downloadable_file',
    fieldMarkup: entity.fieldMarkup.length ? entity.fieldMarkup : null,
    fieldMedia: entity.fieldMedia[0],
    fieldTitle: getDrupalValue(entity.fieldTitle),
  },
});
module.exports = {
  filter: ['field_markup', 'field_media', 'field_title'],
  transform,
};
