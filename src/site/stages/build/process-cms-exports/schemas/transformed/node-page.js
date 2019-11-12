// const { getFilter } = require('../../filters');

module.exports = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    fieldIntroText: {
      type: 'string',
    },
    fieldDescription: {
      type: ['string', 'null'],
    },
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
      type: 'object',
      properties: {
        entity: {
          type: ['null'],
        },
      },
    },
    fieldRelatedLinks: {
      type: 'array',
      items: {
        $ref: 'transformed/paragraph-list_of_link_teasers',
      },
    },
    fieldAdministration: {
      type: 'array',
      items: {
        $ref: 'transformed/taxonomy_term-administration',
      },
    },
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
  // required: getFilter('node-page'),
};
