const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'leadership_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldLeadership: entity.fieldLeadership[0],
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice:
    entity.fieldOffice[0] &&
    !ancestors.find(r => r.entity.uuid === entity.fieldOffice[0].uuid)
      ? { entity: entity.fieldOffice[0] }
      : null,
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'metatag',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_leadership',
    'field_meta_title',
    'field_office',
  ],
  transform,
};
