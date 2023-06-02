import HouseholdExpensesChecklist from '../../components/HouseholdExpensesChecklist';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  householdExpensesChecklist: {
    'ui:title': 'Which of these expenses do you pay for?',
    'ui:widget': HouseholdExpensesChecklist,
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
