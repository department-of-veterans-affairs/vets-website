import ItemLoop from '../../components/ItemLoop';
import TableDetailsView from '../../components/TableDetailsView';

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
      'ui:options': {
        viewType: 'table',
        viewField: TableDetailsView,
        doNotScroll: true,
        showSave: true,
        expandUnder: 'hasAdditionalIncome',
      },
      items: {
        'ui:title': 'Additional income',
        incomeType: {
          'ui:title': 'Income Type',
        },
        monthlyAmount: {
          'ui:title': 'Monthly Amount',
        },
        employerName: {
          'ui:title': 'Employer Name',
        },
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
                enum: ['Income Type 1', 'Income Type 2', 'Income Type 3'],
              },
              monthlyAmount: {
                type: 'string',
              },
              employerName: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
