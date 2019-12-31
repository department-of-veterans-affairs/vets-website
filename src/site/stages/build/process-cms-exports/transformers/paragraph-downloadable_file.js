const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'downloadable_file',
    fieldMarkup: getDrupalValue(entity.fieldMarkup),
    fieldMedia: getDrupalValue(entity.fieldMedia),
    fieldTitle: getDrupalValue(entity.fieldTitle),
  },
});
module.exports = {
  filter: ['field_markup', 'field_media', 'field_title'],
  transform,
};
