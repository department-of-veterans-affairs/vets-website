/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    field_alert: { $ref: 'GenericNestedString' },
    field_content_block: { $ref: 'EntityReferenceArray' },
    field_featured_content: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_related_links: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_table_of_contents_boolean: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'title',
    'changed',
    'path',
    'field_alert',
    'field_content_block',
    'field_featured_content',
    'field_intro_text',
    'field_office',
    'field_related_links',
    'field_table_of_contents_boolean',
  ],
};
