/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    status: { $ref: 'GenericNestedBoolean' },
    path: { $ref: 'RawPath' },
    metatag: { $ref: 'RawMetaTags' },
    field_nickname_for_this_facility: { $ref: 'GenericNestedString' },
    field_link_facility_emerg_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          // maxItems: 0 until we have an example of what they look like
          options: { type: 'array', maxItems: 0 },
        },
        required: ['uri', 'title', 'options'],
      },
    },
    field_leadership: { $ref: 'EntityReferenceArray' },
    reverse_field_region_page: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'title',
    'status',
    'path',
    'metatag',
    // Turns out this sometimes just isn't there
    // 'field_link_facility_emerg_list',
    'field_nickname_for_this_facility',
    'field_leadership',
    'reverse_field_region_page',
  ],
};
