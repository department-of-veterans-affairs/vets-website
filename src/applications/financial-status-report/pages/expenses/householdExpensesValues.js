import React from 'react';
import HouseholdExpensesInputList from '../../components/HouseholdExpensesInputList';
import { validateCurrencyArray } from '../../utils/validations';

export const uiSchema = {
  'ui:title': 'Your monthly expenses',
  expenses: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        How much do you pay for each housing expense every month?
      </span>
    ),
    'ui:field': HouseholdExpensesInputList,
    'ui:options': {
      hideOnReview: true,
    },
    expenseRecords: {
      'ui:title': 'householdExpensesInputList',
      'ui:validations': [validateCurrencyArray],
      items: {
        name: {
          'ui:title': 'Name of expense',
        },
        amount: {
          'ui:title': 'Expense amount',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    expenses: {
      type: 'object',
      properties: {
        expenseRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
