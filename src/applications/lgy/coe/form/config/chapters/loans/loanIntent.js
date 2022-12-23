import React from 'react';

import { LOAN_INTENT } from '../../../constants';

// replacing loanIntent from schemaImports
export const schema = {
  type: 'object',
  properties: {
    intent: {
      type: 'string',
      enum: [
        LOAN_INTENT.regular, // new entry, will not be submitted
        LOAN_INTENT.refinance,
        LOAN_INTENT.irrrl,
        LOAN_INTENT.oneTime,
        LOAN_INTENT.inquiry,
      ],
      enumNames: [
        <>
          A <strong>regular restoration of entitlement</strong>
        </>,
        <>
          A regular <strong>cash-out refinance</strong> of a current VA home
          loan
        </>,
        <>
          An <strong>Interest Rate Reduction Refinance Loan</strong> (IRRRL) to
          refinance the balance of a current VA home loan
        </>,
        <>
          A <strong>one-time restoration of entitlement</strong>
        </>,
        <>
          An <strong>entitlement inqury only</strong>
        </>,
      ],
    },
  },
};

export const uiSchema = {
  intent: {
    'ui:widget': 'radio',
    'ui:title': 'How will you use your Certificate of Eligibility?',
    'ui:required': () => true,
  },
};
