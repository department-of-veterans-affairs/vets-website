import HouseholdExpensesExplainerWidget from '../../components/HouseholdExpensesExplainerWidget';

export const uiSchema = {
  'ui:title': ' ',
  expensesExplainer: {
    'ui:title': ' ',
    'ui:widget': HouseholdExpensesExplainerWidget,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    expensesExplainer: {
      type: 'boolean',
    },
  },
};
