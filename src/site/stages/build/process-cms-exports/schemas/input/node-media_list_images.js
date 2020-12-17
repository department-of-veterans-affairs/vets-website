/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { $ref: 'GenericNestedString' },
    field_administration: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_alert_single: { type: 'array', items: { $ref: 'EntityReference' } },
    field_buttons: { type: 'array', items: { $ref: 'EntityReference' } },
    field_buttons_repeat: { $ref: 'GenericNestedBoolean' },
    field_contact_information: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_intro_text_limited_html: { $ref: 'GenericNestedString' },
    field_media_list_images: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_other_categories: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_primary_category: {
      type: 'array',
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
    field_table_of_contents_boolean: { $ref: 'GenericNestedBoolean' },
    field_tags: { type: 'array', items: { $ref: 'EntityReference' } },
    metatag: { $ref: 'RawMetaTags' },
    moderation_state: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    title: { $ref: 'GenericNestedString' },
  },
  required: [
    'changed',
    'field_administration',
    'field_alert_single',
    'field_buttons',
    'field_buttons_repeat',
    'field_contact_information',
    'field_intro_text_limited_html',
    'field_media_list_images',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_table_of_contents_boolean',
    'field_tags',
    'metatag',
    'moderation_state',
    'path',
    'title',
  ],
};
