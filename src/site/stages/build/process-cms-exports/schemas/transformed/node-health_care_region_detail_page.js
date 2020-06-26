const { paragraph } = require('../helpers');
const hcRegionPage = require('./node-health_care_region_page');
const linkTeasers = require('./paragraph-list_of_link_teasers');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_detail_page'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_care_region_detail_page'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAlert: { type: ['string', 'null'] },
    fieldContentBlock: {
      type: 'array',
      items: paragraph(),
    },
    fieldFeaturedContent: {
      type: 'array',
      maxItems: 1,
      items: paragraph(),
    },
    fieldIntroText: { type: 'string' },
    fieldOffice: hcRegionPage,
    fieldRelatedLinks: {
      oneOf: [linkTeasers, { type: 'null' }],
    },
    fieldTableOfContentsBoolean: { type: 'boolean' },
  },
  required: [
    'title',
    'changed',
    'entityUrl',
    'fieldAlert',
    'fieldContentBlock',
    'fieldFeaturedContent',
    'fieldIntroText',
    'fieldOffice',
    'fieldRelatedLinks',
    'fieldTableOfContentsBoolean',
  ],
};
