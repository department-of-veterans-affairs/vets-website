/* eslint-disable camelcase */

const tupleSchema = {
  type: 'array',
  items: { type: 'string' },
  minItems: 2,
  maxItems: 2,
};

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_address: { $ref: 'RawAddress' },
    field_facility_hours: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          value: {
            // It's either an array, or an object masquerading as an array with
            // an additional `caption` property
            type: ['array', 'object'],
            items: tupleSchema,
            properties: {
              0: tupleSchema,
              1: tupleSchema,
              2: tupleSchema,
              3: tupleSchema,
              4: tupleSchema,
              5: tupleSchema,
              6: tupleSchema,
              caption: { type: 'string' },
            },
            required: ['0', '1', '2', '3', '4', '5', '6', 'caption'],
          },
          format: { type: 'null' }, // Only ever seen it as null
          caption: { type: ['string', 'null'] },
        },
        required: ['value', 'format', 'caption'],
      },
    },
    field_facility_locator_api_id: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_local_health_care_service_: {
      // Can't be $ref: 'EntityReferenceArray' because evidently sometimes the
      // items in this array are empty arrays.
      type: 'array',
      items: {
        oneOf: [{ $ref: 'EntityReference' }, { type: 'array', maxItems: 0 }],
      },
    },
    field_location_services: { $ref: 'EntityReferenceArray' },
    field_main_location: { $ref: 'GenericNestedBoolean' },
    field_media: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
    field_mental_health_phone: { $ref: 'GenericNestedString' },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
    field_operating_status_facility: { $ref: 'GenericNestedString' },
    // maxItems: 0 until we have an example of what this should be
    field_operating_status_more_info: { $ref: 'GenericNestedString' },
    field_phone_number: { $ref: 'GenericNestedString' },
    field_region_page: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },

    // Not sure what any of the following should be; all entities had only empty arrays for these
    // jq --slurp 'map(select(.type[0].target_id == "health_care_local_facility")) | map(.field_email_subscription) | map(select(. != []))' node.*.json
    field_email_subscription: { $ref: 'GenericNestedString' },
    field_facebook: { $ref: 'GenericNestedString' },
    field_twitter: { $ref: 'GenericNestedString' },
    field_instagram: { $ref: 'GenericNestedString' },
    field_flickr: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_address',
    'field_email_subscription',
    'field_facebook',
    'field_facility_hours',
    'field_facility_locator_api_id',
    'field_flickr',
    'field_instagram',
    'field_intro_text',
    'field_local_health_care_service_',
    'field_location_services',
    'field_main_location',
    'field_media',
    'field_mental_health_phone',
    'field_nickname_for_this_facility',
    'field_operating_status_facility',
    'field_operating_status_more_info',
    'field_phone_number',
    'field_region_page',
    'field_twitter',
  ],
};
