/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    name: { $ref: 'GenericNestedString' },
    thumbnail: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          alt: { type: 'string' },
          title: { type: ['string', 'null'] },
          width: { type: 'number' },
          height: { type: 'number' },
          ...{ $ref: 'EntityReference' }.properties,
        },
      },
    },
    created: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_media_in_library: { $ref: 'GenericNestedBoolean' },
    field_media_video_embed_field: { $ref: 'GenericNestedString' },
    field_owner: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
  },
  required: [
    'name',
    'thumbnail',
    'created',
    'changed',
    'metatag',
    'path',
    'field_media_in_library',
    'field_media_video_embed_field',
  ],
};
