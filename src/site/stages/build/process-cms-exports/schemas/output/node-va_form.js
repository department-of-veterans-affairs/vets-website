const { usePartialSchema } = require('../../transformers/helpers');

const vaFormSchema = {
  type: 'object',
  properties: {
    fieldVaFormName: { type: 'string' },
    fieldVaFormNumber: { type: 'string' },
    fieldVaFormUsage: { $ref: 'ProcessedString' },
    fieldVaFormUrl: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['uri'],
      },
    },
  },
  required: [
    'fieldVaFormName',
    'fieldVaFormNumber',
    'fieldVaFormUsage',
    'fieldVaFormUrl',
  ],
};

module.exports = {
  type: 'object',
  properties: {
    entityType: { type: 'string', enum: ['node'] },
    entityBundle: { type: 'string', enum: ['va_form'] },
    title: { type: 'string' },
    created: { type: 'number' },
    changed: { type: 'number' },
    entityMetatags: { $ref: 'MetaTags' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldBenefitCategories: {
      type: 'array',
      items: { $ref: 'output/node-landing_page' },
    },
    fieldVaFormAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldVaFormIssueDate: { type: 'string' },
    fieldVaFormLinkTeasers: {
      type: 'array',
      items: { $ref: 'output/paragraph-link_teaser' },
    },
    fieldVaFormName: { type: 'string' },
    fieldVaFormNumber: { type: 'string' },
    fieldVaFormNumPages: { type: 'number' },
    fieldVaFormRelatedForms: {
      type: 'array',
      items: {
        /* eslint-disable react-hooks/rules-of-hooks */
        entity: usePartialSchema(vaFormSchema, [
          'fieldVaFormName',
          'fieldVaFormNumber',
          'fieldVaFormUsage',
          'fieldVaFormUrl',
        ]),
      },
    },
    fieldVaFormRevisionDate: { type: ['string', 'null'] },
    fieldVaFormTitle: { type: 'string' },
    fieldVaFormToolIntro: { type: ['string', 'null'] },
    fieldVaFormToolUrl: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['url'],
      },
    },
    fieldVaFormType: { type: ['string', 'null'] },
    fieldVaFormUrl: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'object',
            properties: {
              path: { type: 'string' },
            },
            required: ['path'],
          },
        },
        required: ['url'],
      },
    },
    fieldVaFormUsage: {
      oneOf: [{ $ref: 'ProcessedString' }, { type: 'null' }],
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'fieldAdministration',
    'fieldBenefitCategories',
    'fieldVaFormAdministration',
    'fieldVaFormIssueDate',
    'fieldVaFormLinkTeasers',
    'fieldVaFormName',
    'fieldVaFormNumber',
    'fieldVaFormNumPages',
    'fieldVaFormRelatedForms',
    'fieldVaFormRevisionDate',
    'fieldVaFormTitle',
    'fieldVaFormToolIntro',
    'fieldVaFormToolUrl',
    'fieldVaFormType',
    'fieldVaFormUrl',
    'fieldVaFormUsage',
  ],
};
