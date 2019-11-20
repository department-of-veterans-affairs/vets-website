import React from 'react';
import moment from 'moment';

import { USA } from '../all-claims/constants';

export const EffectiveDateViewField = ({ formData }) => {
  const { from, to } = formData.effectiveDates;
  const dateFormat = 'MMM D, YYYY';
  const fromDateString = moment(from).format(dateFormat);
  return to ? (
    <p>
      We’ll use this address from {fromDateString} to{' '}
      {moment(to).format(dateFormat)}:
    </p>
  ) : (
    <p>We’ll use this address starting on {fromDateString}:</p>
  );
};

export const hasForwardingAddress = formData =>
  formData?.['view:hasForwardingAddress'] || false;

export const forwardingCountryIsUSA = formData =>
  formData?.forwardingAddress?.country === USA;

export const hasSelectedIssues = formData =>
  formData?.contestedIssues?.some(entry => entry['view:selected']);

// For testing
export const isValidDate = date => date instanceof Date && isFinite(date);

// Add X months to date (for testing forwarding address)
export const addXMonths = numberOfMonths =>
  moment()
    .add(numberOfMonths, 'months')
    .format('YYYY-MM-DD');

// testing
export const $ = (selector, DOM) => DOM.querySelector(selector);
export const $$ = (selector, DOM) => DOM.querySelectorAll(selector);
