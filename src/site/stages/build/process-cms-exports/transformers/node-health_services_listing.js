const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'health_services_listing',
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
  path: getDrupalValue(entity.path),
  fieldAdministration: entity.fieldAdministration[0],
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldFeaturedContentHealthser: entity.fieldFeaturedContentHealthser,
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
    'changed',
    'promote',
    'sticky',
    'default_langcode',
    'revision_translation_affected',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_featured_content_healthser',
    'field_intro_text',
    'field_meta_title',
    'field_office',
  ],
  transform,
};
