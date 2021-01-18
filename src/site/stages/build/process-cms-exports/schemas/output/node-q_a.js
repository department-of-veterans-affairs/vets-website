module.exports = {
  type: 'object',
  properties: {
    entityBundle: { type: 'string', enum: ['q_a'] },
    entityType: { type: 'string', enum: ['node'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    title: { type: 'string' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldAlertSingle: { $ref: 'output/paragraph-alert_single' },
    fieldAnswer: { $ref: 'output/paragraph-rich_text_char_limit_1000' },
    fieldButtons: {
      type: 'array',
      items: { $ref: 'output/paragraph-button' },
    },
    fieldContactInformation: { $ref: 'output/paragraph-contact_information' },
    fieldOtherCategories: {
      type: 'array',
      items: { $ref: 'output/taxonomy_term-lc_categories' },
    },
    fieldPrimaryCategory: { $ref: 'output/taxonomy_term-lc_categories' },
    fieldRelatedBenefitHubs: {
      type: ['array', 'null'],
      items: {
        type: 'object',
        required: ['entity'],
        properties: {
          entity: { $ref: 'output/node-landing_page' },
        },
      },
    },
    fieldRelatedInformation: {
      type: 'array',
      items: { $ref: 'output/paragraph-link_teaser' },
    },
    fieldStandalonePage: { type: 'boolean' },
    fieldTags: {
      $ref: 'output/paragraph-audience_topics',
    },
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'entityPublished',
    'fieldAnswer',
    'fieldButtons',
    'fieldContactInformation',
    'fieldOtherCategories',
    'fieldPrimaryCategory',
    'fieldRelatedBenefitHubs',
    'fieldRelatedInformation',
    'fieldStandalonePage',
    'fieldTags',
  ],
};
