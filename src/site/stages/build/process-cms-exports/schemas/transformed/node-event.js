module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['event'] },
    title: { type: 'string' },
    entityUrl: {
      // Probably should pull this out into a common schema
      type: 'object',
      properties: {
        breadcrumb: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  routed: { type: 'boolean' },
                },
                required: ['path', 'routed'],
              },
              text: { type: 'string' },
            },
            required: ['url', 'text'],
          },
        },
        path: { type: 'string' },
      },
      required: ['breadcrumb', 'path'],
    },
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
      type: ['object', 'null'],
      properties: {
        processed: { type: 'string' },
      },
    },
    fieldAddress: {
      type: ['object', 'null'],
      properties: {
        addressLine1: { type: 'string' },
        addressLine2: { type: 'string' },
        locality: { type: 'string' },
        administrativeArea: { type: 'string' },
      },
    },
    fieldBody: {
      type: 'object',
      properties: {
        processed: { type: 'string' },
      },
    },
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
    fieldMedia: { $ref: 'Media' },
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
