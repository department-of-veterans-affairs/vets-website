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
