import React from 'react';

// VA loan numbers are _always_ 12 digits (no dashes or spaces), according
// to SME responses, see:
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/45026#issuecomment-1235860405
export const LOAN_NUMBER_DIGIT_LENGTH = 12;
export const NON_DIGIT_REGEX = /[^\d]/g;

export const LOAN_INTENT = {
  regular: {
    value: 'REGULAR', // ignored by the backend
    label: (
      <>
        A <strong>regular restoration of entitlement</strong>
      </>
    ),
    shortLabel: 'A regular restoration',
  },
  refinance: {
    value: 'REFI', // cash out refinance
    label: (
      <>
        A <strong>cash-out refinance</strong>
      </>
    ),
    shortLabel: 'A regular cash-out refinance',
  },
  irrrl: {
    value: 'IRRRL',
    label: (
      <>
        An <strong>Interest Rate Reduction Refinance Loan</strong> (IRRRL)
      </>
    ),
    shortLabel: 'An Interest Rate Reduction Refinance Loan',
  },
  oneTime: {
    value: 'ONETIMERESTORATION',
    label: (
      <>
        A <strong>one-time restoration of entitlement</strong>
      </>
    ),
    shortLabel: 'A one-time restoration',
  },
  inquiry: {
    value: 'INQUIRY',
    label: (
      <>
        An <strong>entitlement inquiry only</strong>
      </>
    ),
    shortLabel: 'An inquiry only',
  },
};

const intents = Object.values(LOAN_INTENT);
export const LOAN_INTENT_SCHEMA = {
  type: 'string',
  enum: intents.map(intent => intent.value),
  enumNames: intents.map(intent => intent.label),
};
