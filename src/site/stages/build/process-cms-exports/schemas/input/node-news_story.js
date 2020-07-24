/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    promote: { $ref: 'GenericNestedBoolean' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_author: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
    field_full_story: { $ref: 'GenericNestedString' },
    field_image_caption: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_media: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
    field_office: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
  },
  required: [
    'title',
    'created',
    'promote',
    'moderation_state',
    'metatag',
    'path',
    'field_author',
    'field_full_story',
    'field_image_caption',
    'field_intro_text',
    'field_media',
    // Apparently this isn't always there
    // 'field_office',
  ],
};
