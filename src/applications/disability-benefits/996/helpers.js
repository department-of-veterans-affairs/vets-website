import React from 'react';
// import { connect } from 'react-redux';
// import moment from 'moment';

import { DateWidget } from 'platform/forms-system/src/js/review/widgets';

import { AddressViewField } from '../all-claims/utils';

export const ForwardingAddressViewField = ({ formData }) => {
  const { effectiveDate } = formData;
  return (
    <div>
      <EffectiveDateViewField formData={effectiveDate} />
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
