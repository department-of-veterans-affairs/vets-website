import React from 'react';
import HouseholdExpensesChecklist from '../../components/HouseholdExpensesChecklist';

export const uiSchema = {
  'ui:title': 'Your monthly expenses NEW',
  householdExpensesChecklist: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any additional income you receive:
      </span>
    ),
    'ui:widget': HouseholdExpensesChecklist,
    'ui:required': formData => {
      const {
        additionalIncome: { addlIncRecords = [] },
      } = formData;

      return !addlIncRecords.length;
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
    additionalIncomeChecklist: {
      type: 'boolean',
    },
  },
};
