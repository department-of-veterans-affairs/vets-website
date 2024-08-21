import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { validateCurrency } from '../../utils/validations';
// import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default {
  uiSchema: {
    expenses: {
      'ui:title': 'Monthly housing expenses',
      monthlyHousingExpenses: {
        'ui:title':
          'What is the total amount you pay for rent and/or mortgage payments each month?',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          classNames: 'schemaform-currency-input-v3',
          currency: true,
          width: 'lg',
          hint:
            '\nMortgage can include homeowners insurance, property tax, private mortgage insurance (PMI), and Community Development District (CDD) fees.',
        },
        'ui:required': () => true,
        'ui:errorMessages': {
          pattern: 'Please enter a valid dollar amount',
          required: 'Please enter an amount',
        },
        'ui:validations': [validateCurrency],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      expenses: {
        type: 'object',
        required: ['monthlyHousingExpenses'],
        properties: {
          monthlyHousingExpenses: {
            type: 'string',
          },
        },
      },
    },
  },
};
