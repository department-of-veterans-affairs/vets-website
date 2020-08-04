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
    field_description: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_meta_title: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    reverse_field_list: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'title',
    'created',
    'changed',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_description',
    'field_intro_text',
    'field_meta_title',
    'field_office',
  ],
};
