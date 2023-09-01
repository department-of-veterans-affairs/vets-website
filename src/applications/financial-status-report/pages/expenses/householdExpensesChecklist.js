import HouseholdExpensesChecklist from '../../components/householdExpenses/HouseholdExpensesChecklist';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  'ui:field': HouseholdExpensesChecklist,
  householdExpensesChecklist: {
    'ui:title': 'householdExpensesChecklist',
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdExpensesChecklist: {
      type: 'boolean',
    },
  },
};
