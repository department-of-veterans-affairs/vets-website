const {
  getDrupalValue,
  isPublished,
  createMetaTagArray,
} = require('./helpers');

const transform = (entity, { ancestors }) => ({
  entityType: 'node',
  entityBundle: 'vamc_operating_status_and_alerts',
  title: getDrupalValue(entity.title),
  entityPublished: isPublished(getDrupalValue(entity.status)),
  entityMetatags: createMetaTagArray(entity.metatag.value),
  fieldBannerAlert: (entity.fieldBannerAlert || []).filter(
    // Apparently sometimes we get an array of alerts with array items:
    // "field_banner_alert": [
    //   [], // What's this doing here??
    //   {
    //       "target_type": "node",
    //       "target_uuid": "adca4bef-9266-473f-8162-7d0a55084d25"
    //   },
    // ]
    i => !Array.isArray(i),
  ),
  fieldFacilityOperatingStatus: entity.fieldFacilityOperatingStatus.map(n => ({
    entity: {
      title: n.title,
      entityUrl: n.entityUrl,
      fieldOperatingStatusFacility: n.fieldOperatingStatusFacility,
      fieldOperatingStatusMoreInfo: n.fieldOperatingStatusMoreInfo,
    },
  })),
  fieldLinks: entity.fieldLinks,
  fieldOffice: entity.fieldOffice[0]
    ? {
        entity: !ancestors.find(
          r => r.entity.uuid === entity.fieldOffice[0].uuid,
        )
          ? entity.fieldOffice[0]
          : {
              entityLabel: getDrupalValue(entity.fieldOffice[0].title),
              entityType: entity.fieldOffice[0].entityType,
            },
      }
    : null,
  fieldOperatingStatusEmergInf: {
    value: getDrupalValue(entity.fieldOperatingStatusEmergInf),
  },
});

module.exports = {
  filter: [
    'title',
    'status',
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
