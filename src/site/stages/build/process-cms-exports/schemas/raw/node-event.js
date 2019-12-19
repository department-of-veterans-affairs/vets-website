/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    uid: { $ref: 'EntityReferenceArray' },
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
            og_image_height: { type: 'string' }, // Which is also a number
          },
        },
      },
    },
    field_additional_information_abo: { $ref: 'GenericNestedString' },
    field_address: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          locality: { type: 'string' },
          administrative_area: { type: 'string' }, // Looks like this acts like 'state'
          country_code: { type: 'string' },
          address_line1: { type: 'string' },
          address_line2: { type: 'string' },
          dependent_locality: { type: ['string', 'null'] },
          postal_code: { type: ['string', 'null'] },
          sorting_code: { type: ['string', 'null'] },
          // Why are these even here???
          langcode: { type: 'string' },
          given_name: { type: ['string', 'null'] },
          family_name: { type: ['string', 'null'] },
          additional_name: { type: ['string', 'null'] },
          organization: { type: ['string', 'null'] },
        },
        required: [
          'locality',
          'administrative_area',
          'country_code',
          'address_line1',
          'address_line2',
          'dependent_locality',
          'postal_code',
          'sorting_code',
          'langcode',
          'given_name',
          'family_name',
          'additional_name',
          'organization',
        ],
      },
    },
    field_body: { $ref: 'GenericNestedString' },
    field_date: {
      type: 'array',
      items: {
        properties: {
          // These are actually timestamps like: 2019-05-30T21:00:00
          value: { type: 'string' },
          end_value: { type: 'string' },
        },
        required: ['value', 'end_value'],
      },
    },
    field_description: { $ref: 'GenericNestedString' },
    field_event_cost: { $ref: 'GenericNestedString' },
    field_event_cta: { $ref: 'GenericNestedString' },
    field_event_registrationrequired: { $ref: 'GenericNestedBoolean' },
    field_facility_location: { $ref: 'EntityReferenceArray' },
    field_link: {
      // Might be worth pulling this out into a common schema
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          options: { type: 'array' }, // all exampels are empty
        },
        required: ['uri', 'title', 'options'],
      },
    },
    field_location_humanreadable: { $ref: 'GenericNestedString' },
    field_media: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'title',
    'uid',
    'changed',
    'path',
    'metatag',
    'field_additional_information_abo',
    'field_address',
    'field_body',
    'field_date',
    'field_description',
    'field_event_cost',
    'field_event_cta',
    'field_event_registrationrequired',
    'field_facility_location',
    'field_link',
    'field_location_humanreadable',
    'field_media',
  ],
};
