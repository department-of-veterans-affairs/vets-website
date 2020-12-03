import ItemLoop from '../components/ItemLoop';
import CardDetailsView from '../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseAdditionalIncome: {
    'ui:title': 'Does your spouse currently receive any additional income?',
    'ui:widget': 'yesNo',
    'ui:required': () => false,
  },
  hasAdditionalIncome: {
    'ui:options': {
      expandUnder: 'spouseAdditionalIncome',
    },
    spouseAdditionalIncome: {
      'ui:field': ItemLoop,
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
      },
      items: {
        'ui:title': 'Additional income:',
        incomeType: {
          'ui:title': 'Income Type',
        },
        monthlyAmount: {
          'ui:title': 'Monthly Amount',
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    spouseAdditionalIncome: {
      type: 'boolean',
    },
    hasAdditionalIncome: {
      type: 'object',
      properties: {
        spouseAdditionalIncome: {
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
            },
          },
        },
      },
    },
  },
};
