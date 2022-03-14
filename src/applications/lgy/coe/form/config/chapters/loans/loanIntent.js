import React from 'react';

import { loanIntent } from '../../schemaImports';

loanIntent.properties.intent.enumNames = [
  <>
    A <strong>restoration of entitlement</strong> to purchase a new home
  </>,
  <>
    A regular <strong>cash-out refinance</strong> of a current VA home loan
  </>,
  <>
    An <strong>Interest Rate Reduction Refinance Loan</strong> (IRRRL) to
    refinance the balance of a current VA home loan
  </>,
  <>
    An <strong>entitlement inqury</strong> only
  </>,
];

export const schema = loanIntent;

export const uiSchema = {
  intent: {
    'ui:widget': 'radio',
    'ui:title': 'How will you use your Certificate of Eligibility?',
    'ui:required': () => true,
  },
};
