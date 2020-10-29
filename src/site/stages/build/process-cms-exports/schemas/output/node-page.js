// const { getFilter } = require('../../filters');

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
    fieldTableOfContentsBoolean: { type: ['boolean', 'null'] },
    fieldFeaturedContent: {
      type: 'array',
      items: {
        $ref: 'Paragraph',
      },
    },
    fieldContentBlock: {
      type: 'array',
      items: {
        $ref: 'Paragraph',
      },
    },
    fieldAlert: {
      type: ['object', 'null'],
    },
    fieldRelatedLinks: {
      $ref: 'output/paragraph-list_of_link_teasers',
    },
    fieldAdministration: {
      $ref: 'output/taxonomy_term-administration',
    },
    fieldPageLastBuilt: {
      type: 'object',
      properties: {
        date: { type: 'string' },
      },
      required: ['date'],
    },
    entityMetatags: {
      $ref: 'MetaTags',
    },
    entityPublished: { type: 'boolean' },
  },
  // required: getFilter('node-page'),
};
