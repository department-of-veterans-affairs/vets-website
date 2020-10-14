/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    promote: { $ref: 'GenericNestedBoolean' },
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
    field_listing: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
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
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
    field_featured: { $ref: 'GenericNestedBoolean' },
    // Ignoring while non existent uids are referenced in the export
    // uid: {
    //   type: 'array',
    //   items: { $ref: 'EntityReference' },
    //   maxItems: 1,
    // },
  },
  required: [
    'title',
    // 'uid',
    'created',
    'promote',
    'metatag',
    'path',
    'field_author',
    'field_full_story',
    'field_image_caption',
    'field_intro_text',
    'field_listing',
    'field_media',
    'status',
    'field_featured',
    // Apparently this isn't always there
    // 'field_office',
  ],
};
