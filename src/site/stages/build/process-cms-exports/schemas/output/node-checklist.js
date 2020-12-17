/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { type: 'number' },
    entityBundle: { type: 'string', enum: ['checklist'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    entityType: { type: 'string', enum: ['node'] },
    fieldAlertSingle: { $ref: 'output/paragraph-alert_single' },
    fieldButtons: {
      type: 'array',
      items: { $ref: 'output/paragraph-button' },
    },
    fieldButtonsRepeat: { type: 'boolean' },
    fieldChecklist: { $ref: 'output/paragraph-checklist' },
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
    fieldTags: {
      $ref: 'output/paragraph-audience_topics',
    },
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
    title: { type: 'string' },
  },
  required: [
    'changed',
    'entityBundle',
    'entityMetatags',
    'entityPublished',
    'entityType',
    'fieldContentBlock',
    'fieldDescription',
    'fieldIntroTextLimitedHtml',
    'fieldMetaTitle',
    'fieldProduct',
    'fieldTableOfContentsBoolean',
    'status',
    'title',
  ],
};
