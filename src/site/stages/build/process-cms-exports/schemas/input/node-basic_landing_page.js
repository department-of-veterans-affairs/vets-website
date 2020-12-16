/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { $ref: 'GenericNestedString' },
    field_administration: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_content_block: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_description: { $ref: 'GenericNestedString' },
    field_intro_text_limited_html: { $ref: 'GenericNestedString' },
    field_meta_title: { $ref: 'GenericNestedString' },
    field_product: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_table_of_contents_boolean: { $ref: 'GenericNestedBoolean' },
    metatag: { $ref: 'RawMetaTags' },
    moderation_state: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    title: { $ref: 'GenericNestedString' },
  },
  required: [
    'changed',
    'field_administration',
    'field_content_block',
    'field_description',
    'field_intro_text_limited_html',
    'field_meta_title',
    'field_product',
    'field_table_of_contents_boolean',
    'metatag',
    'moderation_state',
    'path',
    'title',
  ],
};
