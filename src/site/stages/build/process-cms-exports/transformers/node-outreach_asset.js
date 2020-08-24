const {
  createMetaTagArray,
  getDrupalValue,
  utcToEpochTime,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'outreach_asset',
  title: getDrupalValue(entity.title),
  created: utcToEpochTime(getDrupalValue(entity.created)),
  changed: utcToEpochTime(getDrupalValue(entity.changed)),
  moderationState: getDrupalValue(entity.moderationState),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldAdministration: entity.fieldAdministration[0],
  fieldBenefits: getDrupalValue(entity.fieldBenefits),
  fieldDescription: getDrupalValue(entity.fieldDescription),
  fieldFormat: getDrupalValue(entity.fieldFormat),
  fieldListing: entity.fieldListing[0],
  fieldMedia:
    entity.fieldMedia && entity.fieldMedia.length
      ? { entity: entity.fieldMedia[0] }
      : null,
});

module.exports = {
  filter: [
    'title',
    'created',
    'changed',
    'moderation_state',
    'metatag',
    'field_administration',
    'field_benefits',
    'field_description',
    'field_format',
    'field_listing',
    'field_media',
  ],
  transform,
};
