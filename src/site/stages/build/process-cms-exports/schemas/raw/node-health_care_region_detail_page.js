/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    path: { $ref: 'GenericNestedString' },
    field_alert: { $ref: 'GenericNestedString' },
    field_content_block: { $ref: 'GenericNestedString' },
    field_featured_content: { $ref: 'GenericNestedString' },
    field_intro_text: { $ref: 'GenericNestedString' },
    field_office: { $ref: 'GenericNestedString' },
    field_related_links: { $ref: 'GenericNestedString' },
    field_table_of_contents_boolean: { $ref: 'GenericNestedString' },
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
