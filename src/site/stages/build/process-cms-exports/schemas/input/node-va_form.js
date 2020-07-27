/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_administration: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_benefit_categories: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_va_form_administration: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_va_form_issue_date: { $ref: 'GenericNestedString' },
    field_va_form_name: { $ref: 'GenericNestedString' },
    field_va_form_number: { $ref: 'GenericNestedString' },
    field_va_form_num_pages: { $ref: 'GenericNestedString' },
    field_va_form_revision_date: { $ref: 'GenericNestedString' },
    field_va_form_title: { $ref: 'GenericNestedString' },
    field_va_form_type: { $ref: 'GenericNestedString' },
    field_va_form_url: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          options: { type: 'array' },
        },
        required: ['uri', 'title', 'options'],
      },
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'metatag',
    'path',
    'field_administration',
    'field_benefit_categories',
    'field_va_form_administration',
    'field_va_form_issue_date',
    'field_va_form_name',
    'field_va_form_number',
    'field_va_form_num_pages',
    'field_va_form_revision_date',
    'field_va_form_title',
    'field_va_form_type',
    'field_va_form_url',
  ],
};
