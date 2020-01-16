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
        og_title: { type: 'string' },
        og_description: { type: 'string' },
        og_image_height: {
          type: 'string',
          pattern: '^\\d*$', // It's a string that acts like a number
        },
      },
      // No properties are required intentionally
    },
  },
};
