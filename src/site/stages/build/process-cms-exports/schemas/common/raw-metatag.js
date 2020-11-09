/* eslint-disable camelcase */

module.exports = {
  $id: 'RawMetaTags',
  type: 'object',
  properties: {
    value: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        twitter_cards_type: { type: 'string' },
        og_site_name: { type: 'string' },
        twitter_cards_description: { type: 'string' },
        description: { type: 'string' },
        twitter_cards_title: { type: 'string' },
        twitter_cards_site: { type: 'string' },
        abstract: { type: 'string' },
        image_src: { type: 'string' },
        og_title: { type: 'string' },
        keywords: { type: 'string' },
        og_description: { type: 'string' },
        og_image_height: {
          type: 'string',
          pattern: '^\\d*$', // It's a string that acts like a number
        },
        twitter_cards_image: { type: 'string' },
        og_image_0: { type: 'string' },
      },
      // No properties are required intentionally
    },
  },
};
