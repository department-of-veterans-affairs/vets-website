import AdditionalIncomeCheckList from '../../../components/AdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': '',
  'ui:field': AdditionalIncomeCheckList,
  additionalIncomeCheckList: {
    'ui:title': 'additionalIncomeCheckList',
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncomeCheckList: {
      type: 'boolean',
    },
  },
};
