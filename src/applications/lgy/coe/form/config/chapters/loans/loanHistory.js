import React from 'react';
import {
  createUSAStateLabels,
  formatReviewDate,
} from '~/platform/forms-system/src/js/helpers';
import {
  validateDate,
  validateDateRange,
} from '~/platform/forms-system/src/js/validation';
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

// NOTE: These will be removed after schema is update in vets-json-schema
delete loanHistory.properties.loans.items.properties.title;
loanHistory.properties.loans.items.properties.loanNumber = {
  type: 'number',
  title: 'VA loan number',
  properties: {},
};

export const schema = loanHistory;

export const uiSchema = {
  loans: {
    'ui:description': 'Tell us about all your VA-backed loans',
    'ui:options': {
      itemName: 'VA-backed Loan',
      viewField: PreviousLoanView,
      keepInPageOnReview: true,
    },
    items: {
      'ui:options': {
        itemName: 'VA-backed loan',
      },
      dateRange: {
        'ui:validations': [validateDateRange],
        'ui:errorMessages': {
          pattern: 'Date loan ended must be after the start of the loan',
          required: 'Please enter a date',
        },
        from: {
          'ui:title': 'Closing date of your loan',
          'ui:widget': 'date',
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
        },
        to: {
          'ui:title':
            'Date you paid off your loan (Leave this blank if it’s not paid off)',
          'ui:widget': 'date',
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
      },
      address: {
        'ui:title': 'Property address',
        'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
        street: {
          'ui:title': 'Street address',
          'ui:errorMessages': { required: 'Please enter a street address' },
        },
        street2: {
          'ui:title': 'Street address line 2',
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
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
      loanNumber: {},
      isCurrentlyOwned: {
        'ui:title': 'Do you still own this property?',
        'ui:widget': 'yesNo',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      willRefinance: {
        'ui:title': 'Do you want to refinance this loan?',
        'ui:widget': 'yesNo',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
    },
  },
};
