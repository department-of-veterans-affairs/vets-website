const { partialSchema } = require('../../transformers/helpers');
const pressReleaseSchema = require('./node-press_release');

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['press_releases_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: {
      type: 'object',
      properties: {
        entity: { $ref: 'output/node-health_care_region_page' },
      },
    },
    fieldPressReleaseBlurb: { type: ['string', 'null'] },
    reverseFieldListingNode: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            entity: partialSchema(pressReleaseSchema, [
              'title',
              'fieldReleaseDate',
              'entityUrl',
              'promote',
              'created',
              'fieldIntroText',
              'entityPublished',
            ]),
          },
        },
      },
    },
    entityPublished: { type: 'boolean' },
    status: { type: 'boolean' },
  },
  required: [
    'title',
    'created',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
    'fieldPressReleaseBlurb',
    'reverseFieldListingNode',
    'entityPublished',
    'status',
  ],
};
