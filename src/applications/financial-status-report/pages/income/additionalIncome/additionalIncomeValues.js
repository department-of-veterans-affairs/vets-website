import AdditionalIncomeInputList from '../../../components/AdditionalIncomeInputList';
import { validateAddlIncomeValues } from '../../../utils/validations';

export const uiSchema = {
  'ui:title': '',
  additionalIncome: {
    'ui:title': 'Your other income',
    'ui:field': AdditionalIncomeInputList,
    'ui:options': {
      hideOnReview: true,
    },
    addlIncRecords: {
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
