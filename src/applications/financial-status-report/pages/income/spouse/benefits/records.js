import { validateCurrency } from '../../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  benefits: {
    spouseBenefits: {
      'ui:options': {
        classNames: 'max-width-400',
      },
      compensationAndPension: {
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
      education: {
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
          required: ['compensationAndPension', 'education'],
          properties: {
            compensationAndPension: {
              type: 'string',
            },
            education: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
