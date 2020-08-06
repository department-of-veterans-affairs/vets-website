const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
  isPublished,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'story_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldIntroText: getDrupalValue(entity.fieldIntroText),
  fieldMetaTitle: getDrupalValue(entity.fieldMetaTitle),
  fieldOffice: entity.fieldOffice[0],
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
  ],
  transform,
};
