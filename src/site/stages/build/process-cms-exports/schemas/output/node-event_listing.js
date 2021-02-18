const { partialSchema } = require('../../transformers/helpers');
const eventSchema = require('./node-event');

const reverseFieldSchema = {
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      items: {
        entity: partialSchema(eventSchema, [
          'title',
          'entityUrl',
          'fieldDatetimeRangeTimezone',
          'fieldDescription',
          'fieldLocationHumanreadable',
        ]),
      },
    },
  },
};

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-event_listing'] },
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['event_listing'] },
    entityUrl: { $ref: 'EntityUrl' },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: ['string', 'null'] },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: {
      oneOf: [
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-health_care_region_page' },
          },
        },
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-office' },
          },
        },
        { type: 'null' },
      ],
    },
    reverseFieldListingNode: reverseFieldSchema,
    pastEvents: reverseFieldSchema,
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'entityUrl',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
    'reverseFieldListingNode',
    'pastEvents',
  ],
};
