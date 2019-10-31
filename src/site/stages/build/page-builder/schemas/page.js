/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: {
      $ref: '/GenericNestedString',
    },
    field_intro_text: {
      $ref: '/GenericNestedString',
    },
    field_description: {
      $ref: '/GenericNestedString',
    },
    field_featured_content: {
      $ref: '/EntityReferenceArray',
    },
    field_content_block: {
      $ref: '/EntityReferenceArray',
    },
    field_alert: {
      $ref: '/EntityReferenceArray',
    },
    field_related_links: {
      $ref: '/EntityReferenceArray',
    },
    field_administration: {
      $ref: '/EntityReferenceArray',
    },
    field_page_last_built: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  required: [
    'title',
    'field_intro_text',
    'field_description',
    'field_featured_content',
    'field_content_block',
    // 'field_alert',
    'field_related_links',
    'field_administration',
    // 'field_page_last_built',
  ],
};
