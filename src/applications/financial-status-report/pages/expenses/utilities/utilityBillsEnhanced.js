import UtilityBillChecklist from '../../../components/utilityBills/UtilityBillChecklist';
import UtilityBillInputList from '../../../components/utilityBills/UtilityBillInputList';
import { validateCurrencyArray } from '../../../utils/validations';

export const utilityBillChecklist = {
  uiSchema: {
    'ui:title': '',
    'ui:field': UtilityBillChecklist,
    'ui:options': {
      hideOnReview: true,
    },
    utilityBills: {
      'ui:title': 'utilityBillChecklist',
    },
  },
  schema: {
    type: 'object',
    properties: {
      utilityBills: {
        type: 'boolean',
      },
    },
  },
};

export const utilityBillValues = {
  uiSchema: {
    'ui:title': '',
    'ui:field': UtilityBillInputList,
    utilityRecords: {
      'ui:title': 'utilityBillValues',
      'ui:validations': [validateCurrencyArray],
      items: {
        name: {
          'ui:title': 'Name of utility bill',
        },
        amount: {
          'ui:title': 'Utility bill amount',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      utilityRecords: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
