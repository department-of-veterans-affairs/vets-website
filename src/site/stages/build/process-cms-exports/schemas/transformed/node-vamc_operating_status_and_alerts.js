module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-vamc_operating_status_and_alerts'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['vamc_operating_status_and_alerts'] },
    title: { type: 'string' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldBannerAlert: {
      type: 'array',
      items: { $ref: 'transformed/node-full_width_banner_alert' },
      // maxItems: 1 // Presumably? The template expects an array, though...
    },
    fieldFacilityOperatingStatus: {
      type: 'array',
      items: { $ref: 'transformed/node-health_care_local_facility' },
    },
    fieldLinks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          uri: { type: 'string' },
        },
        required: ['title', 'uri'],
      },
    },
    fieldOffice: {
      oneOf: [
        { $ref: 'transformed/node-health_care_region_page' },
        { type: 'null' },
      ],
    },
    fieldOperatingStatusEmergInf: { type: ['string', 'null'] },
  },
  required: [
    'title',
    'entityPublished',
    'entityMetatags',
    'entityUrl',
    'fieldBannerAlert',
    'fieldFacilityOperatingStatus',
    'fieldLinks',
    'fieldOffice',
    'fieldOperatingStatusEmergInf',
  ],
};
