import { validateCurrency } from '../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your monthly household expenses',
  expenses: {
    rentOrMortgage: {
      'ui:title':
        'How much do you spend on housing each month? Please include expenses such as rent, mortgage, taxes, and HOA fees.',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your housing expense information.',
      },
      'ui:validations': [validateCurrency],
    },
    food: {
      'ui:title': 'How much do you pay for food each month?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your food expenses information.',
      },
      'ui:validations': [validateCurrency],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    expenses: {
      type: 'object',
      required: ['rentOrMortgage', 'food'],
      properties: {
        rentOrMortgage: {
          type: 'string',
        },
        food: {
          type: 'string',
        },
      },
    },
  },
};
