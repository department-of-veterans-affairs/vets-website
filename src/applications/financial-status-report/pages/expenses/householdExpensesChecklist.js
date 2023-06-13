import HouseholdExpensesChecklist from '../../components/HouseholdExpensesChecklist';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  'ui:field': HouseholdExpensesChecklist,
  'ui:options': {
    hideOnReview: true,
  },
  householdExpensesChecklist: {
    'ui:title': 'householdExpensesChecklist',
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
