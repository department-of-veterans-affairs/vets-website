import React from 'react';
import moment from 'moment';

import { AddressViewField } from '../all-claims/utils';

export const ForwardingAddressViewField = ({ formData }) => (
  <>
    <EffectiveDateViewField formData={formData} />
    <AddressViewField formData={formData} />
  </>
);

const EffectiveDateViewField = ({ formData }) => {
  const { from, to } = formData.effectiveDates;
  const dateFormat = 'MMM D, YYYY';
  const fromDateString = moment(from).format(dateFormat);
  return to ? (
    <p>
      We’ll use this address starting on {fromDateString} until{' '}
      {moment(to).format(dateFormat)}:
    </p>
  ) : (
    <p>We’ll use this address starting on {fromDateString}:</p>
  );
};

// For testing
export const isValidDate = date => date instanceof Date && isFinite(date);

// Add X months to date (for testing forwarding address)
export const addXMonths = (origDate, numberOfMonths) => {
  const date = new Date(origDate);
  const modDate = new Date(date.setMonth(date.getMonth() + numberOfMonths));
  return modDate.toISOString().split('T')[0];
};

// phoneEmailViewField formatting uses "name: value", e.g.
// Primary phone: ###-###-####
// Email address: abc@abc.com
export const extractValueFromText = text => {
  const [, result] = text.split(':');
  return result?.trim() || '';
};
