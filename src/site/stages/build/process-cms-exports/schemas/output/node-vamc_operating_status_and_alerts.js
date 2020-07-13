const { usePartialSchema } = require('../../transformers/helpers');
const localFacilitySchema = require('./node-health_care_local_facility');

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
      items: { $ref: 'output/node-full_width_banner_alert' },
      // maxItems: 1 // Presumably? The template expects an array, though...
    },
    fieldFacilityOperatingStatus: {
      type: 'array',
      items: {
        // Yes, it's wrapped in entity here, but not in the originating schema
        /* eslint-disable react-hooks/rules-of-hooks */
        entity: usePartialSchema(localFacilitySchema, [
          'title',
          'entityUrl',
          'fieldOperatingStatusFacility',
          'fieldOperatingStatusMoreInfo',
        ]),
      },
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
        { $ref: 'output/node-health_care_region_page' },
        { type: 'null' },
      ],
    },
    fieldOperatingStatusEmergInf: {
      // Literally everywhere else, this would be a straight-up string
      type: 'object',
      properties: {
        value: { type: 'string' },
      },
    },
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
