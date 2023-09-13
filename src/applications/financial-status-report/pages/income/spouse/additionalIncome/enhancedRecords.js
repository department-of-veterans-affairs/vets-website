import SpouseAdditionalIncomeInputList from '../../../../components/householdIncome/SpouseAdditionalIncomeInputList';
import { validateAddlIncomeValues } from '../../../../utils/validations';

export const uiSchema = {
  'ui:title': '',
  additionalIncome: {
    'ui:title': "Your spouse's other income",
    'ui:field': SpouseAdditionalIncomeInputList,
    'ui:options': {
      hideOnReview: true,
    },
    spouse: {
      'ui:title': '',
    },
    spAddlIncome: {
      'ui:title': 'addlIncRecords',
      'ui:validations': [validateAddlIncomeValues],
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
