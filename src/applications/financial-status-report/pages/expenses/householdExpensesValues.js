import HouseholdExpensesInputList from '../../components/HouseholdExpensesInputList';
import { validateCurrencyArray } from '../../utils/validations';

export const uiSchema = {
  'ui:title': '',
  expenses: {
    'ui:title': '',
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
