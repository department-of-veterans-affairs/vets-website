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
    },
    field_related_links: {
      $ref: 'EntityReferenceArray',
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
    metatag: {
      type: 'object',
    },
  },
  required: getFilter('node-page'),
};
