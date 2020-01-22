const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'vamc_operating_status_and_alerts',
    title: getDrupalValue(entity.title),
    moderationState: getDrupalValue(entity.moderationState),
    metatag: getDrupalValue(entity.metatag),
    path: getDrupalValue(entity.path),
    fieldBannerAlert: getDrupalValue(entity.fieldBannerAlert),
    fieldFacilityOperatingStatus: getDrupalValue(
      entity.fieldFacilityOperatingStatus,
    ),
    fieldLinks: getDrupalValue(entity.fieldLinks),
    fieldOffice: getDrupalValue(entity.fieldOffice),
    fieldOperatingStatusEmergInf: getDrupalValue(
      entity.fieldOperatingStatusEmergInf,
    ),
  },
});
module.exports = {
  filter: [
    'title',
    'moderation_state',
    'metatag',
    'path',
    'field_banner_alert',
    'field_facility_operating_status',
    'field_links',
    'field_office',
    'field_operating_status_emerg_inf',
  ],
  transform,
};
