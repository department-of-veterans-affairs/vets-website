const { media } = require('../helpers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['event'] },
    title: { type: 'string' },
    entityUrl: { $ref: 'EntityUrl' },
    entityMetaTags: {
      // Probably should be a common schema...except it's got
      // __typename instead of type, so it's different.
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __typename: { type: 'string' },
          key: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
    entityPublished: { type: 'boolean' },
    changed: { type: 'number' },
    uid: {
      type: 'object',
      properties: {
        targetId: { type: 'number' },
        entity: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            timezone: { type: ['null'] }, // All the exmaples are null
          },
        },
      },
    },
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
    fieldDescription: { type: 'string' },
    fieldEventCost: { type: ['string', 'null'] },
    fieldEventCta: { type: ['string', 'null'] },
    fieldEventRegistrationrequired: { type: 'boolean' },
    fieldFacilityLocation: { type: ['object', 'null'] }, // When it's an object, it's an entity of some sort
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
    fieldMedia: media(),
  },
  required: [
    'title',
    'uid',
    'changed',
    'entityUrl',
    'entityMetatags',
    'entityPublished',
    'fieldAdditionalInformationAbo',
    'fieldAddress',
    'fieldBody',
    'fieldDate',
    'fieldDescription',
    'fieldEventCost',
    'fieldEventCta',
    'fieldEventRegistrationrequired',
    'fieldFacilityLocation',
    'fieldLink',
    'fieldLocationHumanreadable',
    'fieldMedia',
  ],
};
