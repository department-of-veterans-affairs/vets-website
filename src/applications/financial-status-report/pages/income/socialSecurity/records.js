import { validateCurrency } from '../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your other income',
  socialSecurity: {
    socialSecurityAmount: {
      'ui:title': 'How much do you get for Social Security each month?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your Social Security benefits information.',
      },
      'ui:validations': [validateCurrency],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    socialSecurity: {
      type: 'object',
      required: ['socialSecurityAmount'],
      properties: {
        socialSecurityAmount: {
          type: 'string',
        },
      },
    },
  },
};
