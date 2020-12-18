import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasAdditionalIncome: {
      'ui:title': 'Do you currently receive any additional income?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    additionalIncomeRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Please provide additional income you currently receive.',
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        expandUnder: 'hasAdditionalIncome',
        itemName: 'Add income',
      },
      items: {
        incomeType: {
          'ui:title': 'Type of income',
        },
        monthlyAmount: currencyUI('Monthly income amount'),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        hasAdditionalIncome: {
          type: 'boolean',
        },
        additionalIncomeRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              incomeType: {
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
