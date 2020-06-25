import React from 'react';

export const fields = [
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Type',
    value: 'type',
  },
  {
    label: 'Method',
    value: 'method',
  },
  {
    label: 'Bank name',
    value: 'bank',
  },
  {
    label: 'Account',
    value: 'account',
  },
];

export const clientServerErrorContent = receivedOrReturned => (
  <>
    <h3>No {receivedOrReturned} payments</h3>
    <p>We were unable to get {receivedOrReturned} payments for your account.</p>
  </>
);
