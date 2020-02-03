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
    metatag: { $ref: 'RawMetaTags' },
    field_additional_information_abo: { $ref: 'GenericNestedString' },
    field_address: { $ref: 'RawAddress' },
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
