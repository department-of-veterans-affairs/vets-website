const { media } = require('../helpers');
const personProfile = require('./node-person_profile');
const hcRegionPage = require('./node-health_care_region_page');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-news_story'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['news_story'] },
    title: { type: 'string' },
    created: { type: 'number' },
    promote: { type: 'boolean' },
    entityPublished: { type: 'boolean' },
    entityMetatags: { $ref: 'MetaTags' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAuthor: {
      oneOf: [personProfile, { type: 'null' }],
    },
    fieldFullStory: { $ref: 'ProcessedString' },
    fieldImageCaption: { type: ['string', 'null'] },
    fieldIntroText: { type: 'string' },
    fieldMedia: { oneOf: [media(), { type: 'null' }] },
    fieldOffice: {
      oneOf: [hcRegionPage, { type: 'null' }],
    },
  },
  required: [
    'title',
    'created',
    'promote',
    'entityPublished',
    'entityMetatags',
    'entityUrl',
    'fieldAuthor',
    'fieldFullStory',
    'fieldImageCaption',
    'fieldIntroText',
    'fieldMedia',
    'fieldOffice',
  ],
};
