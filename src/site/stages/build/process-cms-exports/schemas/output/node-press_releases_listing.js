const { usePartialSchema } = require('../../transformers/helpers');
const pressReleaseSchema = require('./node-press_release');

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['press_releases_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: { $ref: 'output/node-health_care_region_page' },
    fieldPressReleaseBlurb: { type: 'string' },
    reverseFieldListingNode: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            /* eslint-disable react-hooks/rules-of-hooks */
            entity: usePartialSchema(pressReleaseSchema, [
              'title',
              'fieldReleaseDate',
              'entityUrl',
              'promote',
              'created',
              'fieldIntroText',
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
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
    'fieldPressReleaseBlurb',
    'reverseFieldListingNode',
  ],
};
