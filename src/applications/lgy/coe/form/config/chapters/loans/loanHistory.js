import React from 'react';

import {
  createUSAStateLabels,
  formatReviewDate,
} from 'platform/forms-system/src/js/helpers';
import {
  validateDate,
  validateDateRange,
} from 'platform/forms-system/src/js/validation';
import { states } from 'platform/forms/address';

import { loanHistory } from '../../schemaImports';

const stateLabels = createUSAStateLabels(states);

const PreviousLoanView = ({ formData }) => {
  const {
    propertyAddress1,
    propertyCity,
    propertyState,
    propertyZip,
  } = formData.propertyAddress;
  let from = '';
  let to = '';
  if (formData.dateRange) {
    from = formatReviewDate(formData.dateRange.startDate);
    to = formatReviewDate(formData.dateRange.paidOffDate);
  }

  return (
    <div>
      <div>
        <strong>
          {`${propertyAddress1}, ${propertyCity}, ${propertyState}, ${propertyZip}`}
        </strong>
      </div>
      <div>{to ? `${from} - ${to}` : `${from} - present`}</div>
    </div>
  );
};

export const schema = loanHistory;

export const uiSchema = {
  relevantPriorLoans: {
    'ui:description': 'Tell us about all your VA-backed loans',
    'ui:options': {
      itemName: 'VA-backed Loan',
      viewField: PreviousLoanView,
      keepInPageOnReview: true,
    },
    items: {
      'ui:options': {
        classNames: 'column',
        itemName: 'VA-backed loan',
      },
      dateRange: {
        'ui:validations': [validateDateRange],
        'ui:errorMessages': {
          pattern: 'Date loan ended must be after the start of the loan',
          required: 'Please enter a date',
        },
        startDate: {
          'ui:title': 'Closing date of your loan',
          'ui:widget': 'date',
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
        },
        paidOffDate: {
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
      propertyAddress: {
        'ui:title': 'Property address',
        'ui:order': [
          'propertyAddress1',
          'propertyAddress2',
          'propertyCity',
          'propertyState',
          'propertyZip',
        ],
        propertyAddress1: {
          'ui:title': 'Street address',
          'ui:errorMessages': { required: 'Please enter a street address' },
        },
        propertyAddress2: {
          'ui:title': 'Street address line 2',
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        propertyCity: {
          'ui:title': `City`,
          'ui:errorMessages': { required: 'Please enter a city' },
        },
        propertyState: {
          'ui:title': 'State',
          'ui:options': {
            labels: stateLabels,
          },
          'ui:errorMessages': { required: 'Please enter a state' },
        },
        propertyZip: {
          'ui:title': 'Postal code',
          'ui:options': { widgetClassNames: 'usa-input-medium' },
          'ui:errorMessages': {
            required: 'Please enter a postal code',
            pattern:
              'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
          },
        },
      },
      vaLoanNumber: {
        'ui:options': { widgetClassNames: 'usa-input-medium' },
      },
      propertyOwned: {
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
