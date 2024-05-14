import SpouseAdditionalIncomeInputList from '../../../../components/householdIncome/SpouseAdditionalIncomeInputList';
import {
  validateAddlIncomeValues,
  validateSpouseAdditionalIncomeArrayLimits,
} from '../../../../utils/validations';

export const uiSchema = {
  'ui:title': '',
  additionalIncome: {
    'ui:title': '',
    spouse: {
      'ui:title': "Your spouse's other income",
      'ui:field': SpouseAdditionalIncomeInputList,
      'ui:options': {
        hideOnReview: true,
      },
      spAddlIncome: {
        'ui:title': 'spAddlIncome',
        'ui:validations': [
          validateAddlIncomeValues,
          validateSpouseAdditionalIncomeArrayLimits,
        ],
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
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            spAddlIncome: {
              type: 'array',
              items: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};
