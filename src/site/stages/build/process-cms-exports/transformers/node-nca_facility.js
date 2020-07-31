const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'nca_facility',
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
  fieldFacilityLocatorApiId: getDrupalValue(entity.fieldFacilityLocatorApiId),
  fieldOperatingStatusFacility: getDrupalValue(
    entity.fieldOperatingStatusFacility,
  ),
  fieldOperatingStatusMoreInfo: getDrupalValue(
    entity.fieldOperatingStatusMoreInfo,
  ),
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
    'field_facility_locator_api_id',
    'field_operating_status_facility',
    'field_operating_status_more_info',
  ],
  transform,
};
