const { usePartialSchema } = require('../../transformers/helpers');
const pressReleaseSchema = require('./node-press_release');

const reverseFieldSchema = {
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      items: {
        /* eslint-disable react-hooks/rules-of-hooks */
        entity: usePartialSchema(pressReleaseSchema, [
          'title',
          'entityUrl',
          'promote',
          'created',
          'fieldIntroText',
          'fieldReleaseDate',
        ]),
      },
    },
  },
};

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['press_releases_listing'] },
    title: { type: 'string' },
    created: { type: 'string' },
    changed: { type: 'string' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
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
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
    'reverseFieldListingNode',
  ],
};
