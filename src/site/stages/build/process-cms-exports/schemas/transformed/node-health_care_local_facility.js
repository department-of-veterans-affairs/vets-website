const healthCareLocalHealthService = require('./node-health_care_local_health_service');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_facility'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_care_local_facility'] },
    title: { type: 'string' },
    changed: { title: 'epoch-time', type: 'number' },
    entityPublished: { title: 'published-state', type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAddress: { $ref: 'Address' },
    fieldEmailSubscription: { type: ['string', 'null'] },
    fieldFacebook: { type: ['string', 'null'] },
    fieldFacilityHours: {
      type: 'object',
      properties: {
        value: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
            // Expect [0] to be the day name and [1] to be the hours
            minItems: 2,
            maxItems: 2,
          },
          // Expect all the days of the week
          minItems: 7,
          maxItems: 7,
        },
      },
    },
    fieldFacilityLocatorApiId: { type: ['string', 'null'] },
    fieldFlickr: { type: ['string', 'null'] },
    fieldInstagram: { type: ['string', 'null'] },
    fieldIntroText: { type: ['string', 'null'] },
    fieldLocalHealthCareService: {
      type: ['array', 'null'],
      // Alternatively, we can pull out only the bits of this schema that we'll use,
      // but for now, that' just more work.
      items: healthCareLocalHealthService,
    },
    fieldLocationServices: {
      type: ['array', 'null'],
      items: {
        $ref: 'transformed/paragraph-health_care_local_facility_servi',
      },
    },
    fieldMainLocation: { type: 'boolean' },
    fieldMedia: { $ref: 'Media' },
    fieldMentalHealthPhone: { type: ['string', 'null'] },
    fieldNicknameForThisFacility: { type: ['string', 'null'] },
    // Could probably be an enum, but it's not clear what all the possible values are
    fieldOperatingStatusFacility: { type: 'string' },
    // Only found null as an example; not sure what else it's supposed to be
    fieldOperatingStatusMoreInfo: { type: 'null' },
    fieldPhoneNumber: { type: ['string', 'null'] },
    fieldRegionPage: {
      oneOf: [
        { $ref: 'transformed/node-health_care_region_page' },
        { type: 'null' },
      ],
    },
    fieldTwitter: { type: ['string', 'null'] },
  },
  required: [
    'title',
    'changed',
    'entityPublished',
    'entityMetatags',
    'entityUrl',
    'fieldAddress',
    'fieldEmailSubscription',
    'fieldFacebook',
    'fieldFacilityHours',
    'fieldFacilityLocatorApiId',
    'fieldFlickr',
    'fieldInstagram',
    'fieldIntroText',
    'fieldLocalHealthCareService',
    'fieldLocationServices',
    'fieldMainLocation',
    'fieldMedia',
    'fieldMentalHealthPhone',
    'fieldNicknameForThisFacility',
    'fieldOperatingStatusFacility',
    'fieldOperatingStatusMoreInfo',
    'fieldPhoneNumber',
    'fieldRegionPage',
    'fieldTwitter',
  ],
};
