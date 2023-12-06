import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import get from 'platform/utilities/data/get';

import { getLoanIntent } from '../config/helpers';

export default {
  loanClose: {
    title: 'Closing date of your loan',
    value: data => formatReviewDate(get('dateRange.from', data, ''), true),
  },
  loanPaid: {
    title:
      'Date you paid off your loan (Leave this blank if it’s not paid off)',
    value: data => formatReviewDate(get('dateRange.to', data, ''), true),
    error: 'Date loan ended must be after the start of the loan',
  },
  address1: {
    title: 'Street address',
    value: data => get('propertyAddress.propertyAddress1', data, ''),
    error: 'Enter a street address',
  },
  address2: {
    title: 'Street address line 2',
    value: data => get('propertyAddress.propertyAddress2', data, ''),
  },
  city: {
    title: 'City',
    value: data => get('propertyAddress.propertyCity', data, ''),
    error: 'Enter a city',
  },
  state: {
    title: 'State',
    value: data => get('propertyAddress.propertyState', data, ''),
    error: 'Enter a state',
  },
  postal: {
    title: 'Postal code',
    value: data => get('propertyAddress.propertyZip', data, ''),
    error: 'Enter a postal code',
    pattern: 'Enter a valid 5- or 9-digit postal code (dashes allowed)',
  },
  loanNumber: {
    title: 'VA loan number',
    description: 'This number has 12 digits.',
    value: data => get('vaLoanNumber', data, ''),
    pattern: 'Enter numbers only (dashes allowed)',
    lengthError: 'Make sure you include 12 digits.',
    unique: 'Enter a unique loan number',
  },
  owned: {
    title: 'Do you still own this property?',
    value: data => (get('propertyOwned', data, '') ? 'Yes' : 'No'),
  },
  intent: {
    title: 'How will you use your Certificate of Eligibility?',
    value: data => getLoanIntent(get('intent', data, ''))?.shortLabel || '',
  },
};
