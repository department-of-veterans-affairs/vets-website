/* eslint-disable camelcase */

const socialMediaLinkSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      uri: { type: 'string' },
      title: { type: 'string' },
    },
    required: ['uri', 'title'],
  },
};

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
    field_govdelivery_id_emerg: { $ref: 'GenericNestedString' },
    field_govdelivery_id_news: { $ref: 'GenericNestedString' },
    field_operating_status: socialMediaLinkSchema,
    reverse_field_region_page: { $ref: 'EntityReferenceArray' },
    reverse_field_office: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'title',
    'status',
    'path',
    'metatag',
    // Turns out this sometimes just isn't there
    // 'field_link_facility_emerg_list',
    'field_nickname_for_this_facility',
    'field_govdelivery_id_emerg',
    'field_govdelivery_id_news',
    'field_operating_status',
    'reverse_field_region_page',
    'reverse_field_office',
  ],
};
