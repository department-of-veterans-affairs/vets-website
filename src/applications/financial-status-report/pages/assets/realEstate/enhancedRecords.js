import { validateCurrency } from '../../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  assets: {
    realEstateValue: {
      'ui:title': 'What is the estimated value of all your properties?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter the value of all your properties.',
      },
      'ui:validations': [validateCurrency],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    assets: {
      type: 'object',
      required: ['realEstateValue'],
      properties: {
        realEstateValue: {
          type: 'string',
        },
      },
    },
  },
};
