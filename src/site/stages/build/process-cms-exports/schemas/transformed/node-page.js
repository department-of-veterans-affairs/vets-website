// const { getFilter } = require('../../filters');

module.exports = {
  $id: 'node-page',
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
        $ref: 'paragraph-list_of_link_teasers',
      },
    },
    fieldAdministration: {
      type: 'array',
      items: {
        $ref: 'taxonomy_term-administration',
      },
    },
    fieldPageLastBuilt: {
      type: 'string',
    },
    entityMetaTags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          key: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
  },
  // required: getFilter('node-page'),
};
