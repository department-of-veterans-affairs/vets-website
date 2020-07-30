/* eslint-disable camelcase */

const entityReferenceSchema = require('../common/entity-reference');

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
          ...entityReferenceSchema.properties,
        },
      },
    },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_media_in_library: { $ref: 'GenericNestedBoolean' },
    field_media_video_embed_field: { $ref: 'GenericNestedString' },
  },
  required: [
    'name',
    'thumbnail',
    'metatag',
    'path',
    'field_media_in_library',
    'field_media_video_embed_field',
  ],
};
