/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['step_by_step'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    title: { type: 'string' },
    fieldAlertSingle: { $ref: 'output/paragraph-alert_single' },
    fieldButtons: {
      type: 'array',
      items: { $ref: 'output/paragraph-button' },
    },
    fieldButtonsRepeat: { type: 'boolean' },
    fieldContactInformation: { $ref: 'output/paragraph-contact_information' },
    fieldIntroTextLimitedHtml: {
      type: ['object', 'null'],
      properties: {
        processed: { type: 'string' },
      },
      required: ['processed'],
    },
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
    fieldSteps: {
      type: 'array',
      items: { $ref: 'output/paragraph-step_by_step' },
    },
    fieldTags: {
      $ref: 'output/paragraph-audience_topics',
    },
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'title',
    'changed',
    'entityMetatags',
    'entityPublished',
    'fieldButtons',
    'fieldButtonsRepeat',
    'fieldContactInformation',
    'fieldIntroTextLimitedHtml',
    'fieldOtherCategories',
    'fieldPrimaryCategory',
    'fieldRelatedBenefitHubs',
    'fieldRelatedInformation',
    'fieldSteps',
    'fieldTags',
  ],
};
