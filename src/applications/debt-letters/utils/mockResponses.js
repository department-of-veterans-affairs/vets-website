const data = [
  {
    adamKey: '1',
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '21',
    benefitType: 'Loan Guaranty (Principal + Interest)',
    amountOverpaid: 0.0,
    amountWithheld: 0.0,
    originalAr: 11599,
    currentAr: 0,
    debtHistory: [
      {
        date: '03/05/2004',
        letterCode: '914',
        status: 'Paid In Full',
        description: 'Account balance cleared via offset, not including TOP.',
      },
    ],
  },
  {
    adamKey: '2',
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '30',
    benefitType: 'Comp & Pen',
    amountOverpaid: 0.0,
    amountWithheld: 0.0,
    originalAr: 13000,
    currentAr: 0,
    debtHistory: [
      {
        date: '12/03/2008',
        letterCode: '488',
        status: 'Death Status - Pending Action',
        description: 'Pending review for reclamation or next action.',
      },
      {
        date: '02/07/2009',
        letterCode: '905',
        status: 'Administrative Write Off',
        description:
          'Full debt amount cleared by return of funds to DMC from outside entities (reclamations, insurance companies, etc.)',
      },
      {
        date: '02/25/2009',
        letterCode: '914',
        status: 'Paid In Full',
        description: 'Account balance cleared via offset, not including TOP.',
      },
    ],
  },
  {
    adamKey: '3',
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '30',
    benefitType: 'Comp & Pen',
    amountOverpaid: 0.0,
    amountWithheld: 0.0,
    originalAr: 12000,
    currentAr: 0,
    debtHistory: [
      {
        date: '09/11/1997',
        letterCode: '914',
        status: 'Paid In Full',
        description: 'Account balance cleared via offset, not including TOP.',
      },
    ],
  },
  {
    adamKey: '4',
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '44',
    benefitType: 'CH35 EDU',
    amountOverpaid: 16000.0,
    amountWithheld: 0.0,
    originalAr: 13000,
    currentAr: 10000,
    debtHistory: [
      {
        date: '09/18/2012',
        letterCode: '100',
        status: 'First Demand Letter - Inactive Benefits',
        description:
          'First due process letter sent when debtor is not actively receiving any benefits.',
      },
      {
        date: '09/28/2012',
        letterCode: '117',
        status: 'Second Demand Letter',
        description:
          'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
      },
      {
        date: '10/17/2012',
        letterCode: '212',
        status: 'Bad Address - Locator Request Sent',
        description:
          'Originates from mail room Beep File (file of bad addresses to be sent to LexisNexis).  Remains in this status until LexisNexis comes back with updated address information.',
      },
      {
        date: '11/14/2012',
        letterCode: '117',
        status: 'Second Demand Letter',
        description:
          'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
      },
      {
        date: '12/11/2012',
        letterCode: '510',
        status:
          'Mailing Status Inactive/Invalid - Forced to TOP/Cross Servicing',
        description:
          'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
      },
      {
        date: '04/11/2013',
        letterCode: '080',
        status: 'Referred To Cross Servicing',
        description: 'Debt referred to Treasury for Cross servicing',
      },
      {
        date: '12/19/2014',
        letterCode: '681',
        status: 'Returned From Cross Servicing - At TOP',
        description:
          'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
      },
    ],
  },
];

const debtLettersVBMS = [
  {
    documentId: '{64B0BDC4-D40C-4C54-86E0-104C987B8D8F}',
    docType: '1213',
    typeDescription: 'DMC - Second Demand Letter',
    receivedAt: '2020-05-29',
  },
  {
    documentId: '{70412535-E39E-4202-B24E-2751D9FBC874}',
    docType: '194',
    typeDescription: 'DMC - First Demand Letter',
    receivedAt: '2020-05-29',
  },
  {
    documentId: '{3626D232-98D9-41AB-AA3A-CD2DDF7DA59C}',
    docType: '194',
    typeDescription: 'DMC - First Demand Letter',
    receivedAt: '2020-05-29',
  },
  {
    documentId: '{641D0414-10A9-4246-9AFD-3C0BE2D62B2F}',
    docType: '1213',
    typeDescription: 'DMC - Second Demand Letter',
    receivedAt: '2020-05-29',
  },
];

function asyncReturn(returnValue, delay = 300) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });
}

export const debtLettersSuccess = () => asyncReturn(data);
export const debtLettersSuccessVBMS = () => asyncReturn(debtLettersVBMS);

export const debtLettersFailure = () =>
  asyncReturn(
    {
      errors: [
        {
          title: 'Debt Letters Failure',
          detail: {
            messages: [
              {
                code: '',
                key: '',
                severity: 'INFO',
                text: '',
              },
            ],
          },
          code: 'DEBTS_ERROR',
          status: '400',
        },
      ],
    },
    1000,
  );
