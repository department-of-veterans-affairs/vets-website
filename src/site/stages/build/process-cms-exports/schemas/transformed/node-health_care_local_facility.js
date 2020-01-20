module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_local_facility'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['node'] },
        entityBundle: { enum: ['health_care_local_facility'] },
        title: { type: 'string' },
        changed: { type: 'string' },
        entityPublished: { type: 'boolean' },
        entityMetatags: { $ref: 'MetaTags' },
        entityUrl: { $ref: 'EntityUrl' },
        fieldAddress: { $ref: 'Address' },
        fieldEmailSubscription: { type: 'string' },
        fieldFacebook: { type: 'string' },
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
          required: ['value'],
        },
        fieldFacilityLocatorApiId: { type: 'string' },
        fieldFlickr: { type: 'string' },
        fieldInstagram: { type: 'string' },
        fieldIntroText: { type: 'string' },
        fieldLocalHealthCareService: {
          type: 'array',
          // Alternatively, we can pull out only the bits of this schema that we'll use,
          // but for now, that' just more work.
          items: { $ref: 'transformed/node-health_care_local_health_service' },
        },
        fieldLocationServices: {
          type: 'array',
          items: {
            $ref: 'transformed/paragraph-health_care_local_facility_servi',
          },
        },
        fieldMainLocation: { type: 'boolean' },
        fieldMedia: {
          oneOf: [{ $ref: 'Media' }, { type: 'null' }],
        },
        fieldMentalHealthPhone: { type: 'string' },
        fieldNicknameForThisFacility: { type: 'string' },
        // Could probably be an enum, but it's not clear what all the possible values are
        fieldOperatingStatusFacility: { type: 'string' },
        fieldPhoneNumber: { type: 'string' },
        fieldRegionPage: {
          oneOf: [
            { $ref: 'transformed/node-health_care_region_page' },
            { type: 'null' },
          ],
        },
        fieldTwitter: { type: 'string' },
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
        'fieldPhoneNumber',
        'fieldRegionPage',
        'fieldTwitter',
      ],
    },
  },
  required: ['entity'],
};
