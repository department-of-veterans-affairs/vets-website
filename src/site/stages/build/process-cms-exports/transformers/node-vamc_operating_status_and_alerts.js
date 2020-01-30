const {
  getDrupalValue,
  isPublished,
  createMetaTagArray,
} = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'vamc_operating_status_and_alerts',
  title: getDrupalValue(entity.title),
  entityPublished: isPublished(getDrupalValue(entity.moderationState)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  entityUrl: {
    breadcrumb: [],
    path: entity.path[0].alias,
  },
  fieldBannerAlert: entity.fieldBannerAlert,
  fieldFacilityOperatingStatus: entity.fieldFacilityOperatingStatus.map(n => ({
    entity: {
      title: n.title,
      entityUrl: n.entityUrl,
      fieldOperatingStatusFacility: n.fieldOperatingStatusFacility,
      fieldOperatingStatusMoreInfo: n.fieldOperatingStatusMoreInfo,
    },
  })),
  fieldLinks: entity.fieldLinks,
  fieldOffice: entity.fieldOffice[0] || null,
  fieldOperatingStatusEmergInf: {
    value: getDrupalValue(entity.fieldOperatingStatusEmergInf),
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
