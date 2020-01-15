/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
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
            og_title: { type: 'string' },
            og_description: { type: 'string' },
          },
          required: [
            'title',
            'twitter_cards_type',
            'og_site_name',
            'twitter_cards_description',
            'description',
            'twitter_cards_title',
            'twitter_cards_site',
            'og_title',
            'og_description',
          ],
        },
      },
    },
    path: { $ref: 'RawPath' },
    field_address: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          langcode: { type: 'string' },
          country_code: { type: 'string' },
          administrative_area: { type: 'string' },
          locality: { type: 'string' },
          dependent_locality: { type: ['string', 'null'] },
          postal_code: { type: ['string', 'null'] },
          sorting_code: { type: ['string', 'null'] },
          address_line1: { type: ['string', 'null'] },
          address_line2: { type: ['string', 'null'] },
          organization: { type: ['string', 'null'] },
          given_name: { type: ['string', 'null'] },
          additional_name: { type: ['string', 'null'] },
          family_name: { type: ['string', 'null'] },
        },
      },
    },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_pdf_version: { $ref: 'GenericNestedString' },
    field_press_release_contact: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_press_release_downloads: { $ref: 'GenericNestedString' },
    field_press_release_fulltext: { $ref: 'GenericNestedString' },
    field_release_date: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'path',
    'field_address',
    'field_intro_text',
    'field_office',
    'field_pdf_version',
    'field_press_release_contact',
    'field_press_release_downloads',
    'field_press_release_fulltext',
    'field_release_date',
  ],
};
