const { paragraph } = require('../helpers');
const listOfLinkTeasersSchema = require('./paragraph-list_of_link_teasers');
const adminSchema = require('./taxonomy_term-administration');

module.exports = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    fieldIntroText: {
      type: ['string', 'null'],
    },
    fieldDescription: {
      type: ['string', 'null'],
    },
    fieldFeaturedContent: {
      type: 'array',
      items: paragraph(),
    },
    fieldContentBlock: {
      type: 'array',
      items: paragraph(),
    },
    fieldAlert: {
      type: ['object', 'null'],
    },
    fieldRelatedLinks: {
      type: 'array',
      items: listOfLinkTeasersSchema,
    },
    fieldAdministration: adminSchema,
    fieldPageLastBuilt: {
      type: 'object',
      properties: {
        date: { type: 'string' },
      },
      required: ['date'],
    },
    entityMetaTags: {
      $ref: 'MetaTags',
    },
  },
  required: [
    'title',
    'fieldIntroText',
    'fieldDescription',
    'fieldFeaturedContent',
    'fieldContentBlock',
    'fieldAlert',
    'fieldRelatedLinks',
    'fieldAdministration',
    'fieldPageLastBuilt',
    'entityMetaTags',
  ],
};
