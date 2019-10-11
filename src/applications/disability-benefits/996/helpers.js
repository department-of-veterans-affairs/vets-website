import React from 'react';

import { DateWidget } from 'platform/forms-system/src/js/review/widgets';
import { AddressViewField } from '../all-claims/utils';

export const ForwardingAddressViewField = ({ formData }) => {
  const { effectiveDates } = formData;
  return (
    <div>
      <EffectiveDateViewField formData={effectiveDates} />
      <AddressViewField formData={formData} />
    </div>
  );
};

const EffectiveDateViewField = ({ formData }) => (
  <p>
    We will use this address starting on{' '}
    <DateWidget value={formData} options={{ monthYear: false }} />:
  </p>
);

export const isValidDate = date => date instanceof Date && isFinite(date);

// Add X months to date (for testing forwarding address)
export const addXMonths = (origDate, numberOfMonths) => {
  const date = new Date(origDate);
  return new Date(date.setMonth(date.getMonth() + numberOfMonths));
};
