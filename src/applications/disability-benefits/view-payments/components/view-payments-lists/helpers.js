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

export const paymentsRecievedContent = (
  <>
    <h3 className="vads-u-font-size--xl">Payments you received</h3>
    <p>
      VA pays benefits on the first day of the month for the previous month. If
      the first day of the month is a weekend or holiday, VA pays benefits on
      the last business day before the 1st. For example, if May 1st is a
      Saturday, benefits would be paid on Friday, April 30.
    </p>
  </>
);

export const paymentsReturnedContent = (
  <>
    <h3 className="vads-u-font-size--xl">Payments returned</h3>
    <p>
      Returned payment information is available for 6 years from the date the
      payment was issued.
    </p>
  </>
);
