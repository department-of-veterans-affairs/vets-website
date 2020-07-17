const {
  getDrupalValue,
  utcToEpochTime,
  createMetaTagArray,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'event_listing',
  entityMetatags: createMetaTagArray(entity.metatag.value),
  title: getDrupalValue(entity.title),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldOffice: entity.fieldOffice[0],
});
module.exports = {
  filter: ['title', 'changed', 'metatag', 'field_intro_text', 'field_office'],
  transform,
};
