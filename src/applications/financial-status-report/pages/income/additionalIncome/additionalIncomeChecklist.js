import AdditionalIncomeCheckList from '../../../components/AdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': '',
  'ui:field': AdditionalIncomeCheckList,
  'ui:options': {
    hideOnReview: true,
  },
  additionalIncomeCheckList: {
    'ui:title': 'additionalIncomeCheckList',
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
