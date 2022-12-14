import React from 'react';

// replacing loanIntent from schemaImports
export const schema = {
  type: 'object',
  properties: {
    intent: {
      type: 'string',
      enum: [
        'REGULAR', // new entry, will not be submitted
        'REFI',
        'IRRRL',
        'ONETIMERESTORATION',
        'INQUIRY',
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
