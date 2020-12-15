import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Other living expenses',
  otherExpenses: {
    hasExpenses: {
      'ui:title': 'Do you have any additional living expenses to include?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    expenseRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Enter other living expenses separately below. Other living expenses include cell phone, clothing, and transportation.',
      'ui:options': {
        expandUnder: 'hasExpenses',
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'Add an expense',
      },
      items: {
        expenseType: {
          'ui:title': 'Type of expense',
        },
        expenseAmount: currencyUI('Monthly payment amount'),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    otherExpenses: {
      type: 'object',
      properties: {
        hasExpenses: {
          type: 'boolean',
        },
        expenseRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              expenseType: {
                type: 'string',
              },
              expenseAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
