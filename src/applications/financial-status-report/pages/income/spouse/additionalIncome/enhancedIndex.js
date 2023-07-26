import SpouseAdditionalIncomeCheckList from '../../../../components/householdIncome/SpouseAdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  'ui:field': SpouseAdditionalIncomeCheckList,
  spouseAdditionalIncomeCheckList: {
    'ui:title': 'spouseAdditionalIncomeCheckList',
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseAdditionalIncomeCheckList: {
      type: 'boolean',
    },
  },
};
