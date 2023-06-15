import OtherExpensesChecklist from '../../../components/otherExpenses/OtherExpensesChecklist';
import OtherExpensesInputList from '../../../components/otherExpenses/OtherExpensesInputList';
import { validateCurrencyArray } from '../../../utils/validations';

export const otherExpensesChecklist = {
  uiSchema: {
    'ui:title': '',
    'ui:field': OtherExpensesChecklist,
    otherLivingExpenses: {
      'ui:title': 'otherExpensesChecklist',
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherLivingExpenses: {
        type: 'boolean',
      },
    },
  },
};

export const otherExpensesValues = {
  uiSchema: {
    'ui:title': '',
    'ui:field': OtherExpensesInputList,
    'ui:options': {
      hideOnReview: true,
    },
    otherExpenses: {
      'ui:title': 'otherExpensesValues',
      'ui:validations': [validateCurrencyArray],
      items: {
        name: {
          'ui:title': 'Name of Expense',
        },
        amount: {
          'ui:title': 'Expense amount',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherExpenses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
