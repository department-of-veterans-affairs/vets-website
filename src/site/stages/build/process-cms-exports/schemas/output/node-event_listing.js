const { usePartialSchema } = require('../../transformers/helpers');
const eventSchema = require('./node-event');

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
    entityPublished: { type: 'boolean' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: ['string', 'null'] },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: {
      oneOf: [
        { $ref: 'output/node-health_care_region_page' },
        { $ref: 'output/node-office' },
      ],
    },
    reverseFieldList: {
      type: 'array',
      items: { $ref: 'output/node-event' },
    },
    pastEvents: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            /* eslint-disable react-hooks/rules-of-hooks */
            entity: usePartialSchema(eventSchema, [
              'title',
              'entityUrl',
              'fieldDate',
              'fieldDescription',
              'fieldLocationHumanreadable',
            ]),
          },
        },
      },
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'entityPublished',
    'fieldAdministration',
    'fieldDescription',
    'entityUrl',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
  ],
};
