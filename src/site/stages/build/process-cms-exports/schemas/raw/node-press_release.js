/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
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
    field_pdf_version: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_press_release_contact: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_press_release_downloads: { $ref: 'EntityReferenceArray' },
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
