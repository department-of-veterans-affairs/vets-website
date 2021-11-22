import React from 'react';
import { validateCurrency } from '../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your household assets',
  'ui:description': (
    <div className="assets-note">
      <strong>Note: </strong> For each question below, include the total amounts
      for you and your spouse. If you don’t have any of these items, answer “0”.
    </div>
  ),
  assets: {
    'ui:options': {
      classNames: 'no-wrap',
    },

    cashInBank: {
      'ui:title':
        'How much money do you have in checking and savings accounts?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your financial information.',
      },
      'ui:validations': [validateCurrency],
    },
    cashOnHand: {
      'ui:title': 'How much other cash do you have access to at this time?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your financial information.',
      },
      'ui:validations': [validateCurrency],
    },
    usSavingsBonds: {
      'ui:title': 'What’s the current value of your U.S. Savings Bonds?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your financial information.',
      },
      'ui:validations': [validateCurrency],
    },
    stocksAndOtherBonds: {
      'ui:title': 'What’s the current value of your stocks and other bonds?',
      'ui:options': {
        classNames: 'schemaform-currency-input',
        widgetClassNames: 'input-size-3',
      },
      'ui:errorMessages': {
        required: 'Please enter your financial information.',
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
      required: [
        'cashInBank',
        'cashOnHand',
        'usSavingsBonds',
        'stocksAndOtherBonds',
      ],
      properties: {
        cashInBank: {
          type: 'string',
        },
        cashOnHand: {
          type: 'string',
        },
        usSavingsBonds: {
          type: 'string',
        },
        stocksAndOtherBonds: {
          type: 'string',
        },
      },
    },
  },
};
