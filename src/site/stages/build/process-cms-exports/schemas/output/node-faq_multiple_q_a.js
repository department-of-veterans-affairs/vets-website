/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { type: 'number' },
    entityBundle: { type: 'string', enum: ['faq_multiple_q_a'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    entityType: { type: 'string', enum: ['node'] },
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
    fieldQAGroups: {
      type: 'array',
      items: { $ref: 'output/paragraph-q_a_group' },
    },
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
  },
  required: [
    'changed',
    'entityBundle',
    'entityMetatags',
    'entityPublished',
    'entityType',
    'fieldIntroTextLimitedHtml',
    'fieldQAGroups',
  ],
};
