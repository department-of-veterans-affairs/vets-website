import React from 'react';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import {
  createUSAStateLabels,
  formatReviewDate,
} from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';

import { loanHistory } from '../../schemaImports';

const stateLabels = createUSAStateLabels(states);

const PreviousLoanView = ({ formData }) => {
  const { street, city, state, postalCode } = formData.address;
  let from = '';
  let to = '';
  if (formData.dateRange) {
    from = formatReviewDate(formData.dateRange.from);
    to = formatReviewDate(formData.dateRange.to);
  }

  return (
    <div>
      <strong>{`${street}, ${city}, ${state}, ${postalCode}`}</strong> <br />
      {to ? `${from} - ${to}` : `${from} - present`}
    </div>
  );
};

export const schema = loanHistory;

export const uiSchema = {
  loans: {
    'ui:title': 'Tell us about all your VA-backed loans',
    'ui:options': {
      itemName: 'VA-backed Loan',
      viewField: PreviousLoanView,
    },
    items: {
      'ui:title': 'Previous loan information',
      'ui:options': {
        itemName: 'VA-backed loan',
      },
      dateRange: dateRangeUI(
        'Date your loan began',
        'Date you paid off your loan (Leave this blank if it’s not paid off)',
        'Date loan ended must be after the start of the loan',
      ),
      address: {
        'ui:title': 'Property address',
        'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
        street: {
          'ui:title': 'Street',
          'ui:errorMessages': { required: 'Please enter a street address' },
        },
        street2: { 'ui:title': 'Line 2' },
        city: {
          'ui:title': `City`,
          'ui:errorMessages': { required: 'Please enter a city' },
        },
        state: {
          'ui:title': 'State',
          'ui:options': {
            labels: stateLabels,
          },
          'ui:errorMessages': { required: 'Please enter a state' },
        },
        postalCode: {
          'ui:title': 'Postal code',
          'ui:options': { widgetClassNames: 'usa-input-medium' },
          'ui:errorMessages': {
            required: 'Please enter a postal code',
            pattern:
              'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
          },
        },
      },
      isCurrentlyOwned: {
        'ui:title': 'Do you still own this property?',
        'ui:widget': 'yesNo',
      },
      willRefinance: {
        'ui:title': 'Do you want to refinance this loan?',
        'ui:widget': 'yesNo',
      },
    },
  },
};
