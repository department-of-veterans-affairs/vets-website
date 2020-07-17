const socialMediaSchema = {
  type: ['object', 'null'],
  properties: {
    url: {
      type: 'object',
      properties: {
        path: { type: 'string' },
      },
      required: ['path'],
    },
    title: { type: 'string' },
  },
  required: ['url', 'title'],
};

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_facility'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_care_local_facility'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAddress: { $ref: 'Address' },
    fieldEmailSubscription: { type: ['string', 'null'] },
    fieldFacebook: socialMediaSchema,
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
    fieldFlickr: socialMediaSchema,
    fieldInstagram: socialMediaSchema,
    fieldIntroText: { type: ['string', 'null'] },
    fieldLocalHealthCareService: {
      type: ['array', 'null'],
      // Alternatively, we can pull out only the bits of this schema that we'll use,
      // but for now, that' just more work.
      items: { $ref: 'output/node-health_care_local_health_service' },
    },
    fieldLocationServices: {
      type: ['array', 'null'],
      items: {
        $ref: 'output/paragraph-health_care_local_facility_servi',
      },
    },
    fieldMainLocation: { type: 'boolean' },
    fieldMedia: { $ref: 'Media' },
    fieldMentalHealthPhone: { type: ['string', 'null'] },
    fieldNicknameForThisFacility: { type: ['string', 'null'] },
    // Could probably be an enum, but it's not clear what all the possible values are
    fieldOperatingStatusFacility: { type: 'string' },
    // Only found null as an example; not sure what else it's supposed to be
    fieldOperatingStatusMoreInfo: { type: ['string', 'null'] },
    fieldPhoneNumber: { type: ['string', 'null'] },
    fieldRegionPage: {
      oneOf: [
        { $ref: 'output/node-health_care_region_page' },
        { type: 'null' },
      ],
    },
    fieldTwitter: socialMediaSchema,
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
