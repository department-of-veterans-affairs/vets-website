/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          format: { type: 'string' },
        },
        required: ['value', 'format'],
      },
      maxItems: 1,
    },
    metatag: {
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
          },
        },
      },
    },
    path: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          langcode: { type: 'string' },
          pathauto: { type: 'number' },
        },
        required: ['alias', 'langcode', 'pathauto'],
      },
      maxItems: 1,
    },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: { $ref: 'GenericNestedString' },
  },
  required: ['title', 'changed', 'metatag', 'path', 'field_intro_text', 'field_office'],
};
