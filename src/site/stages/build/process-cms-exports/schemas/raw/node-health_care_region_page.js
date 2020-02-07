/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
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
  },
  required: [
    'title',
    'moderation_state',
    'path',
    'metatag',
    'field_nickname_for_this_facility',
  ],
};
