import AdditionalIncomeCheckList from '../../../components/AdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncomeChecklist: {
    'ui:title': 'Select any additional income you receive:',
    'ui:widget': AdditionalIncomeCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalIncomeChecklist: {
      type: 'boolean',
    },
  },
};
