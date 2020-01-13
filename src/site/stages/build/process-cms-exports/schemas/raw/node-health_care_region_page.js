/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    path: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
        },
        required: ['alias'],
      },
    },
    metatag: {
      // Probably should be a common schema
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
            image_src: { type: 'string' },
            og_title: { type: 'string' },
            og_description: { type: 'string' },
            twitter_cards_image: { type: 'string' },
            og_image_0: { type: 'string' },
          },
        },
      },
    },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'moderation_state',
    'path',
    'metatag',
    'field_nickname_for_this_facility',
  ],
};
