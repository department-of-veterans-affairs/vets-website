const { partialSchema } = require('../../transformers/helpers');
const healthCareRegionPageSchema = require('./node-health_care_region_page');

module.exports = {
  type: 'object',
  properties: {
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_services_listing'] },
    title: { type: 'string' },
    created: { type: 'number' },
    promote: { type: 'boolean' },
    sticky: { type: 'boolean' },
    defaultLangcode: { type: 'boolean' },
    revisionTranslationAffected: { type: ['boolean', 'null'] },
    moderationState: { type: 'string' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldDescription: { type: 'string' },
    fieldFeaturedContentHealthser: {
      type: 'array',
      items: { $ref: 'output/paragraph-link_teaser' },
    },
    fieldIntroText: { type: 'string' },
    fieldMetaTitle: { type: 'string' },
    fieldOffice: {
      type: ['object', 'null'],
      properties: {
        entity: partialSchema(healthCareRegionPageSchema, [
          'entityUrl',
          'entityType',
          'title',
          'reverseFieldRegionPageNode',
        ]),
      },
    },
  },
  required: [
    'title',
    'created',
    'promote',
    'sticky',
    'defaultLangcode',
    'revisionTranslationAffected',
    'moderationState',
    'entityMetatags',
    'fieldAdministration',
    'fieldDescription',
    'fieldFeaturedContentHealthser',
    'fieldIntroText',
    'fieldMetaTitle',
    'fieldOffice',
  ],
};
