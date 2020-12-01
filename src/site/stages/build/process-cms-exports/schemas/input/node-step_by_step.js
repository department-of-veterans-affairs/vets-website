/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { $ref: 'GenericNestedString' },
    field_alert_single: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_buttons: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_buttons_repeat: { $ref: 'GenericNestedBoolean' },
    field_contact_information: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_intro_text_limited_html: {
      type: ['array', 'null'],
      items: {
        type: ['object', 'null'],
        properties: {
          value: { type: 'string' },
          format: { type: 'string' },
          processed: { type: 'string' },
        },
        required: ['processed'],
      },
    },
    field_other_categories: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_primary_category: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_related_benefit_hubs: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_related_information: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_steps: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_tags: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    // Needed for filtering reverse fields in other transformers
    metatag: { $ref: 'RawMetaTags' },
    moderation_state: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    status: { $ref: 'GenericNestedBoolean' },
    title: { $ref: 'GenericNestedString' },
    uid: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'changed',
    'field_alert_single',
    'field_buttons',
    'field_buttons_repeat',
    'field_contact_information',
    'field_intro_text_limited_html',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_steps',
    'field_tags',
    'metatag',
    'path',
    'status',
    'title',
    'uid',
  ],
};
