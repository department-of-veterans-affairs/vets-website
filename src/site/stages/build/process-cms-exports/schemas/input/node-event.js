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
    field_datetime_range_timezone: {
      type: 'array',
      items: {
        properties: {
          value: { type: 'string' },
          end_value: { type: 'string' },
          timezone: { type: 'string' },
        },
        required: ['value', 'end_value', 'timezone'],
      },
    },
    field_description: { $ref: 'GenericNestedString' },
    field_event_cost: { $ref: 'GenericNestedString' },
    field_event_cta: { $ref: 'GenericNestedString' },
    field_event_registrationrequired: { $ref: 'GenericNestedBoolean' },
    field_facility_location: { $ref: 'EntityReferenceArray' },
    field_featured: { $ref: 'GenericNestedBoolean' },
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
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
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
    'field_datetime_range_timezone',
    'field_description',
    'field_event_cost',
    'field_event_cta',
    'field_event_registrationrequired',
    'field_featured',
    'field_facility_location',
    'field_link',
    'field_location_humanreadable',
    'field_media',
    'status',
  ],
};
