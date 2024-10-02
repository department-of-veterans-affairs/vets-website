import { validateIsNumber } from '../../../utils/validations';

export const uiSchemaEnhanced = {
  questions: {
    'ui:options': {
      hideOnReview: false, // change this to true to hide this question on review page
    },
    hasDependents: {
      'ui:title': 'Number of dependents',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your dependent(s) information.',
      },
      'ui:validations': [validateIsNumber],
    },
  },
};

export const schemaEnhanced = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasDependents'],
      properties: {
        hasDependents: {
          type: 'string',
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:dependentsAdditionalInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
