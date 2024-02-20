import UtilityBillChecklist from '../../../components/utilityBills/UtilityBillChecklist';
import UtilityBillInputList from '../../../components/utilityBills/UtilityBillInputList';
import {
  validateCurrencyArray,
  validateUtilityBillsArrayLimits,
} from '../../../utils/validations';

export const utilityBillChecklist = {
  uiSchema: {
    'ui:title': '',
    'ui:field': UtilityBillChecklist,
    utilityBills: {
      'ui:title': 'utilityBillChecklist',
      'ui:options': {
        hideOnReview: true,
      },
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
      'ui:validations': [
        validateCurrencyArray,
        validateUtilityBillsArrayLimits,
      ],
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
