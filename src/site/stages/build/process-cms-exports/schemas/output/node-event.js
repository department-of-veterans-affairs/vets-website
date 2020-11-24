module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['event'] },
    title: { type: 'string' },
    entityUrl: { $ref: 'EntityUrl' },
    entityPublished: { type: 'boolean' },
    changed: { type: 'number' },
    fieldAdditionalInformationAbo: {
      oneOf: [{ $ref: 'ProcessedString' }, { type: 'null' }],
    },
    fieldAddress: { $ref: 'Address' },
    fieldBody: { $ref: 'ProcessedString' },
    fieldDate: {
      type: 'object',
      properties: {
        startDate: { type: 'string' }, // 2019-06-12 15:00:00 UTC
        value: { type: 'string' }, //     2019-06-12T15:00:00
        endDate: { type: 'string' }, //   2019-06-12 23:00:00 UTC
        endValue: { type: 'string' }, //  2019-06-12T23:00:00
      },
    },
    fieldDatetimeRangeTimezone: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        endValue: { type: ['number', 'null'] },
        timezone: { type: 'string' },
      },
    },
    fieldDescription: { type: ['string', 'null'] },
    fieldEventCost: { type: ['string', 'null'] },
    fieldEventCta: { type: ['string', 'null'] },
    fieldEventRegistrationrequired: { type: 'boolean' },
    fieldFacilityLocation: {
      type: ['object', 'null'],
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityUrl: { $ref: 'EntityUrl' },
            title: { type: 'string' },
          },
          required: ['entityUrl', 'title'],
        },
      },
      required: ['entity'],
    },
    fieldLink: {
      type: ['object', 'null'],
      properties: {
        url: {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
        },
      },
    },
    fieldLocationHumanreadable: { type: ['string', 'null'] },
    fieldMedia: { $ref: 'Media' },
    status: { type: 'boolean' },
  },
  required: [
    'title',
    // 'uid',
    'changed',
    'entityUrl',
    'entityMetatags',
    'entityPublished',
    'fieldAdditionalInformationAbo',
    'fieldAddress',
    'fieldBody',
    'fieldDate',
    'fieldDatetimeRangeTimezone',
    'fieldDescription',
    'fieldEventCost',
    'fieldEventCta',
    'fieldEventRegistrationrequired',
    'fieldFacilityLocation',
    'fieldLink',
    'fieldLocationHumanreadable',
    'fieldMedia',
    'status',
  ],
};
