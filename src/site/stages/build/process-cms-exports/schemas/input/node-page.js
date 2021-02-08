/* eslint-disable camelcase */
const { getFilter } = require('../../filters');

module.exports = {
  type: 'object',
  properties: {
    title: {
      $ref: 'GenericNestedString',
    },
    field_intro_text: {
      $ref: 'GenericNestedString',
    },
    field_intro_text_limited_html: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'ProcessedString' },
    },
    field_description: {
      $ref: 'GenericNestedString',
    },
    field_featured_content: {
      $ref: 'EntityReferenceArray',
    },
    field_content_block: {
      $ref: 'EntityReferenceArray',
    },
    field_alert: {
      type: 'array',
      items: {
        // Sometimes what should be entity references are empty arrays
        oneOf: [{ $ref: 'EntityReference' }, { type: 'array', maxItems: 0 }],
      },
      maxItems: 1,
    },
    field_related_links: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_administration: {
      $ref: 'EntityReferenceArray',
    },
    field_page_last_built: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string', format: 'custom-date-time' },
        },
      },
    },
    field_table_of_contents_boolean: { $ref: 'GenericNestedBoolean' },
    metatag: {
      type: 'object',
    },
    path: { $res: 'RawPath' },
  },
  required: getFilter('node-page'),
};
