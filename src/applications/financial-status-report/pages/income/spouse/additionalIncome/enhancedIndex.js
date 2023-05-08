import SpouseAdditionalIncomeCheckList from '../../../../components/SpouseAdditionalIncomeCheckList';

export const uiSchema = {
  'ui:title': "Your spouse's other income",
  additionalIncomeChecklist: {
    'ui:title': 'Select any additional income your spouse receives:',
    'ui:widget': SpouseAdditionalIncomeCheckList,
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
