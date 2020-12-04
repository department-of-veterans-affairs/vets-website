import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Other living expenses',
  otherExpenses: {
    hasExpenses: {
      'ui:title': 'Do you have any additional living expenses to include?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    expenseRecords: {
      'ui:options': {
        expandUnder: 'hasExpenses',
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
      },
      'ui:field': ItemLoop,
      'ui:description':
        'Enter other living expenses separately below. Other living expenses include cell phone, clothing, and transportation.',
      items: {
        'ui:title': 'Add an expense',
        expenseType: {
          'ui:title': 'Type of expense',
        },
        monthlyAmount: {
          'ui:title': 'Monthly payment amount',
        },
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
              monthlyAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
