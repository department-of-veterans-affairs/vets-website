import SpouseAdditionalIncomeCheckList from '../../../../components/SpouseAdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  'ui:field': SpouseAdditionalIncomeCheckList,
  'ui:options': {
    hideOnReview: true,
  },
  spouseAdditionalIncomeCheckList: {
    'ui:title': 'spouseAdditionalIncomeCheckList',
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
