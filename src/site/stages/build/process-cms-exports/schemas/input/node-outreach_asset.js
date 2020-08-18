/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_administration: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_benefits: { $ref: 'GenericNestedString' },
    field_description: { $ref: 'GenericNestedString' },
    field_format: { $ref: 'GenericNestedString' },
    field_listing: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_media: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_benefits',
    'field_description',
    'field_format',
    'field_media',
  ],
};
