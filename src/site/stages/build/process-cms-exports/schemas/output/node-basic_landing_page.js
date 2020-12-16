/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    changed: { type: 'number' },
    entityBundle: { type: 'string', enum: ['basic_landing_page'] },
    entityMetatags: { $ref: 'MetaTags' },
    entityPublished: { type: 'boolean' },
    entityType: { type: 'string', enum: ['node'] },
    fieldContentBlock: {
      oneOf: [
        { $ref: 'output/paragraph-alert' },
        { $ref: 'output/paragraph-collapsible_panel' },
        { $ref: 'output/paragraph-downloadable_file' },
        { $ref: 'output/paragraph-list_of_link_teasers' },
        { $ref: 'output/paragraph-media' },
        { $ref: 'output/paragraph-number_callout' },
        { $ref: 'output/paragraph-process' },
        { $ref: 'output/paragraph-q_a' },
        { $ref: 'output/paragraph-q_a_section' },
        { $ref: 'output/paragraph-react_widget' },
        { $ref: 'output/paragraph-table' },
        { $ref: 'output/paragraph-wysiwyg' },
      ],
    },
    fieldDescription: {
      type: 'string',
    },
    fieldIntroTextLimitedHtml: {
      type: ['object', 'null'],
      properties: {
        processed: { type: 'string' },
      },
      required: ['processed'],
    },
    fieldMetaTitle: { type: 'string' },
    fieldProduct: {
      $ref: 'output/taxonomy_term-products',
    },
    fieldTableOfContentsBoolean: {
      type: 'boolean',
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
