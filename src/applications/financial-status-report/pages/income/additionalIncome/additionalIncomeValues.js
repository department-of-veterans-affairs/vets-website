import AdditionalIncomeInputList from '../../../components/AdditionalIncomeInputList';

export const uiSchema = {
  'ui:title': '',
  additionalIncome: {
    'ui:title': 'Your other income',
    'ui:field': AdditionalIncomeInputList,
    addlIncRecords: {
      'ui:title': 'addlIncRecords',
      items: {
        name: {
          'ui:title': 'Type of income',
        },
        amount: {
          'ui:title': 'Monthly income amount',
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
        addlIncRecords: {
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
