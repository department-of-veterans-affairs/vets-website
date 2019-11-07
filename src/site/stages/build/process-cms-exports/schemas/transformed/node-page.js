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
      type: 'string',
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
      type: 'array',
    },
    fieldRelatedLinks: {
      type: 'array',
      $ref: 'paragraph-list_of_link_teasers',
    },
    fieldAdministration: {
      $ref: 'taxonomy_term-administration',
    },
    fieldPageLastBuilt: {
      type: 'string',
    },
    entityMetaTags: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        key: { type: 'string' },
        value: { type: 'string' },
      },
    },
  },
  // required: getFilter('node-page'),
};
