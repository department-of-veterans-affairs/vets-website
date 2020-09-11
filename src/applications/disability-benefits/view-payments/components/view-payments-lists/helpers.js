import React from 'react';

export const paymentsReceivedFields = [
  {
    label: 'Date',
    value: 'payCheckDt',
  },
  {
    label: 'Amount',
    value: 'payCheckAmount',
  },
  {
    label: 'Type',
    value: 'payCheckType',
  },
];

export const paymentsReturnedFields = [
  {
    label: 'Issue Date',
    value: 'returnedCheckIssueDt',
  },
  {
    label: 'Cancel Date',
    value: 'returnedCheckCancelDt',
  },
  {
    label: 'Amount',
    value: 'returnedCheckAmount',
  },
  {
    label: 'Type',
    value: 'returnedCheckType',
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
      We pay benefits on the first day of the month for the previous month. If
      the first day of the month is a weekend or holiday, we pay benefits on the
      last business day before the 1st. For example, if May 1 is a Saturday,
      we’d pay benefits on Friday, April 30.
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
