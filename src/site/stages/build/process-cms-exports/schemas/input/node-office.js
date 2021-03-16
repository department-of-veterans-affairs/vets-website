/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    nid: { $ref: 'GenericNestedNumber' },
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_administration: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_body: { $ref: 'GenericNestedString' },
    field_description: { $ref: 'GenericNestedString' },
    field_meta_title: { $ref: 'GenericNestedString' },
  },
  required: [
    'nid',
    'title',
    'created',
    'changed',
    'metatag',
    'path',
    'field_administration',
    'field_body',
    'field_description',
    'field_meta_title',
  ],
};
