/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    path: { $ref: 'RawPath' },
    metatag: { $ref: 'RawMetaTags' },
    changed: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    field_administration: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_alert_single: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_answer: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_buttons: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
    field_contact_information: {
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
    field_standalone_page: { $ref: 'GenericNestedBoolean' },
    field_tags: {
      type: 'array',
      items: { $ref: 'EntityReference' },
    },
  },
  required: [
    'title',
    'path',
    'metatag',
    'changed',
    'moderation_state',
    'field_administration',
    'field_alert_single',
    'field_answer',
    'field_buttons',
    'field_contact_information',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_standalone_page',
    'field_tags',
  ],
};
