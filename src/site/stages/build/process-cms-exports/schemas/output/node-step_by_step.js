/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    path: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          langcode: { type: 'string' },
          pathauto: { type: 'number' },
        },
        required: ['alias', 'langcode', 'pathauto'],
      },
      maxItems: 1,
    },
    metatag: { $ref: 'RawMetaTags' },
    uid: { $ref: 'EntityReferenceArray' },
    title: { $ref: 'GenericNestedString' },
    changed: { type: 'number' },
    fieldAlertSingle: { $ref: 'output/paragraph-alert_single' },
    fieldButtons: { $ref: 'output/paragraph-button' },
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
        entity: { $ref: 'output/node-landing_page' },
      },
    },
    fieldRelatedInformation: { $ref: 'output/paragraph-link_teaser' },
    fieldSteps: {
      type: 'array',
      items: { $ref: 'output/paragraph-step_by_step' },
    },
    fieldTags: {
      type: ['object', 'null'],
      properties: {
        entity: { $ref: 'output/paragraph-audience_topics' },
      },
    },
    // Needed for filtering reverse fields in other transformers
    status: { $ref: 'GenericNestedBoolean' },
  },
  required: [
    'changed',
    'fieldAlertSingle',
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
    'metatag',
    'path',
    'status',
    'title',
    'uid',
  ],
};
