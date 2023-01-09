import React from 'react';
import HouseholdExpensesChecklist from '../../components/HouseholdExpensesChecklist';

export const uiSchema = {
  'ui:title': 'Monthly housing expenses',
  householdExpensesChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Which of these expenses do you pay for?
      </span>
    ),
    'ui:widget': HouseholdExpensesChecklist,
    'ui:required': formData => {
      const {
        householdExpenses: { expenseRecords = [] },
      } = formData;

      return !expenseRecords.length;
    },
    'ui:errorMessages': {
      required: 'Please select at least one household expense.',
    },
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    expenses: {
      type: 'boolean',
    },
  },
};
