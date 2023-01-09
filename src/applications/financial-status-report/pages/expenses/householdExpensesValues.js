import React from 'react';
import HouseholdExpensesInputList from '../../components/HouseholdExpensesInputList';

export const uiSchema = {
  'ui:title': 'Your monthly expenses VALUES',
  householdExpensesInputList: {
    'ui:title': (
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Select any additional income you receive:
      </span>
    ),
    'ui:widget': HouseholdExpensesInputList,
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
    householdExpensesInputList: {
      type: 'boolean',
    },
  },
};
