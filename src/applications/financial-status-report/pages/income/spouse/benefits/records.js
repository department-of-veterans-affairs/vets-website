import { validateCurrency } from '../../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  benefits: {
    spouseBenefits: {
      'ui:options': {
        classNames: 'max-width-400',
      },
      benefitAmount: {
        'ui:title':
          'How much does your spouse get each month for disability compensation and pension benefits?',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-3',
        },
        'ui:errorMessages': {
          required:
            'Please enter your spouse’s VA compensation and pension benefits information.',
        },
        'ui:validations': [validateCurrency],
      },
      educationAmount: {
        'ui:title':
          'How much does your spouse get each month for education benefits?',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-3',
        },
        'ui:errorMessages': {
          required:
            'Please enter your spouse’s VA education benefits information.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    benefits: {
      type: 'object',
      properties: {
        spouseBenefits: {
          type: 'object',
          required: ['benefitAmount', 'educationAmount'],
          properties: {
            benefitAmount: {
              type: 'string',
            },
            educationAmount: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
