// const { getFilter } = require('../../filters');

module.exports = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    fieldIntroTextLimitedHtml: {
      oneOf: [{ type: 'null' }, { $ref: 'ProcessedString' }],
    },
    fieldIntroText: {
      oneOf: [{ type: 'null' }, { $ref: 'ProcessedString' }],
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
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            $ref: 'Paragraph',
          },
        },
      ],
    },
    fieldAlert: {
      type: ['object', 'null'],
    },
    fieldRelatedLinks: {
      oneOf: [
        { type: 'null' },
        { $ref: 'output/paragraph-list_of_link_teasers' },
      ],
    },
    fieldAdministration: {
      $ref: 'output/taxonomy_term-administration',
    },
    fieldPageLastBuilt: {
      oneOf: [
        { type: 'null' },
        {
          type: 'object',
          properties: {
            date: { type: 'string' },
          },
          required: ['date'],
        },
      ],
    },
    entityMetatags: {
      $ref: 'MetaTags',
    },
    entityPublished: { type: 'boolean' },
  },
  // required: getFilter('node-page'),
};
