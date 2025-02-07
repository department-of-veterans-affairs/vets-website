import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { validateCurrency } from '../../utils/validations';

export default {
  uiSchema: {
    expenses: {
      'ui:title': () => (
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Monthly housing expenses</h3>
        </legend>
      ),
      monthlyHousingExpenses: {
        'ui:title':
          'What is the total amount you pay for rent and/or mortgage payments each month?',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
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
