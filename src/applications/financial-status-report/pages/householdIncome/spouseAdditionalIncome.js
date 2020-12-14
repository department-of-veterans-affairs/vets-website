import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

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
        showSave: true,
      },
      items: {
        'ui:title': 'Add income',
        incomeType: {
          'ui:title': 'Type of income',
        },
        incomeAmount: currencyUI('Monthly income amount'),
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
              },
              incomeAmount: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
};
