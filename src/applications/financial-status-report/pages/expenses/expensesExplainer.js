import HouseholdExpensesExplainerWidget from '../../components/householdExpenses/HouseholdExpensesExplainerWidget';

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
