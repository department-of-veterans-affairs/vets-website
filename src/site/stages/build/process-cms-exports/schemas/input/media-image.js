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
          alt: { type: ['string', 'null'] },
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
    field_owner: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    image: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
  },
  required: [
    'fake_test_property_to_cause_error', // Temporary test, remove before merging
    'name',
    'thumbnail',
    'metatag',
    'path',
    'field_media_in_library',
    'image',
  ],
};
