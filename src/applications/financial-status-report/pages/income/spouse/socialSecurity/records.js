import { validateCurrency } from '../../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  socialSecurity: {
    spouse: {
      'ui:options': {
        classNames: 'no-wrap',
      },
      socialSecAmt: {
        'ui:title':
          'How much does your spouse get for Social Security each month?',
        'ui:options': {
          classNames: 'schemaform-currency-input',
          widgetClassNames: 'input-size-3',
        },
        'ui:errorMessages': {
          required:
            'Please enter your spouse’s Social Security benefits information.',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    socialSecurity: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          required: ['socialSecAmt'],
          properties: {
            socialSecAmt: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
