const { usePartialSchema } = require('../../transformers/helpers');
const newsStorySchema = require('./node-news_story');

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['story_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldIntroText: { type: 'string' },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: { $ref: 'output/node-health_care_region_page' },
    reverseFieldListingNode: {
      type: 'object',
      properties: {
        entities: {
          type: 'array',
          items: {
            /* eslint-disable react-hooks/rules-of-hooks */
            entity: usePartialSchema(newsStorySchema, [
              'title',
              'fieldFeatured',
              'entityUrl',
              'promote',
              'created',
              'fieldAuthor',
              'fieldImageCaption',
              'fieldIntroText',
              'fieldMedia',
              'fieldFullStory',
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
    'entityPublished',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
  ],
};
