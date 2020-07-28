const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'locations_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  promote: getDrupalValue(entity.promote),
  sticky: getDrupalValue(entity.sticky),
  defaultLangcode: getDrupalValue(entity.defaultLangcode),
  revisionTranslationAffected: getDrupalValue(
    entity.revisionTranslationAffected,
  ),
  moderationState: getDrupalValue(entity.moderationState),
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
    'promote',
    'sticky',
    'default_langcode',
    'revision_translation_affected',
    'moderation_state',
    'metatag',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
  ],
  transform,
};
