const { partialSchema } = require('../../transformers/helpers');

const dateSchema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        value: { type: 'string' },
        date: { type: 'string' },
      },
    },
    { type: 'null' },
  ],
};

const urlSchema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        uri: { type: 'string' },
      },
    },
    { type: 'null' },
  ],
};

const vaFormSchema = {
  type: 'object',
  properties: {
    fieldVaFormName: { type: 'string' },
    fieldVaFormNumber: { type: 'string' },
    fieldVaFormUsage: { $ref: 'ProcessedString' },
    fieldVaFormUrl: urlSchema,
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
    entityPublished: { type: 'boolean' },
    fieldAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldBenefitCategories: {
      type: 'array',
      items: {
        entity: {
          type: { $ref: 'output/node-landing_page' },
        },
      },
    },
    fieldVaFormAdministration: { $ref: 'output/taxonomy_term-administration' },
    fieldAlert: {
      oneOf: [{ $ref: 'BlockContent' }, { type: 'null' }],
    },
    fieldVaFormIssueDate: dateSchema,
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
        entity: partialSchema(vaFormSchema, [
          'fieldVaFormName',
          'fieldVaFormNumber',
          'fieldVaFormUsage',
          'fieldVaFormUrl',
        ]),
      },
    },
    fieldVaFormRevisionDate: dateSchema,
    fieldVaFormTitle: { type: 'string' },
    fieldVaFormToolIntro: { type: ['string', 'null'] },
    fieldVaFormToolUrl: urlSchema,
    fieldVaFormType: { type: ['string', 'null'] },
    fieldVaFormUrl: urlSchema,
    fieldVaFormUsage: {
      oneOf: [{ $ref: 'ProcessedString' }, { type: 'null' }],
    },
  },
  required: [
    'title',
    'created',
    'changed',
    'entityMetatags',
    'entityPublished',
    'fieldAdministration',
    'fieldAlert',
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
