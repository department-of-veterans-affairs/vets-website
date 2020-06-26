const termAdmin = require('./taxonomy_term-administration');
const alert = require('./block_content-alert');
const promo = require('./block_content-promo');
const linkTeasers = require('./paragraph-list_of_link_teasers');
const supportService = require('./node-support_service');

module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-landing_page'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['landing_page'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAdministration: termAdmin,
    fieldAlert: {
      oneOf: [alert, { type: 'null' }],
    },
    fieldIntroText: { type: 'string' },
    fieldLinks: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['title', 'url'],
      },
    },
    fieldPageLastBuilt: {
      type: 'object',
      properties: {
        date: { type: 'string' },
      },
      required: ['date'],
    },
    fieldPlainlanguageDate: { type: ['string', 'null'] },
    fieldPromo: promo,
    fieldRelatedLinks: {
      oneOf: [linkTeasers, { type: 'null' }],
    },
    fieldSpokes: {
      type: 'array',
      items: linkTeasers,
    },
    fieldSupportServices: {
      type: 'array',
      items: supportService,
    },
    fieldTitleIcon: { type: 'string' },
  },
  required: [
    'title',
    'entityMetatags',
    'changed',
    'entityUrl',
    'entityPublished',
    'fieldAdministration',
    'fieldAlert',
    'fieldIntroText',
    'fieldLinks',
    'fieldPageLastBuilt',
    'fieldPlainlanguageDate',
    'fieldPromo',
    'fieldRelatedLinks',
    'fieldSpokes',
    'fieldSupportServices',
    'fieldTitleIcon',
  ],
};
