/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { type: 'number' },
    entityBundle: { type: 'string', enum: ['support_resources_detail_page'] },
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
    // fieldContentBlock: {
    //   oneOf: [
    //     { $ref: 'output/paragraph-alert' },
    //     { $ref: 'output/paragraph-collapsible_panel' },
    //     { $ref: 'output/paragraph-downloadable_file' },
    //     { $ref: 'output/paragraph-list_of_link_teasers' },
    //     { $ref: 'output/paragraph-media' },
    //     { $ref: 'output/paragraph-number_callout' },
    //     { $ref: 'output/paragraph-process' },
    //     { $ref: 'output/paragraph-q_a' },
    //     { $ref: 'output/paragraph-q_a_section' },
    //     { $ref: 'output/paragraph-react_widget' },
    //     { $ref: 'output/paragraph-table' },
    //     { $ref: 'output/paragraph-wysiwyg' },
    //   ],
    // },
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
  },
  required: [
    'changed',
    'entityBundle',
    'entityMetatags',
    'entityPublished',
    'entityType',
    // 'fieldContentBlock',
    'fieldIntroTextLimitedHtml',
  ],
};
