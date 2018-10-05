import React from 'react';

export const editNote = name => (
  <p>
    <strong>Note:</strong> If you need to update your {name}, please call
    Veterans Benefits Assistance at{' '}
    <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday through Friday, 8:00
    a.m. to 9:00 p.m. (ET).
  </p>
);

export const PaymentDescription = () => (
  <p>
    This is the bank account information we have on file for you. We’ll pay your
    disability benefit to this account.
  </p>
);
