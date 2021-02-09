const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'locations_listing',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
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
