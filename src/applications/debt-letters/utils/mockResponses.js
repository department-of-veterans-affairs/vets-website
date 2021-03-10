const data = {
  hasDependentDebts: true,
  debts: [
    {
      fileNumber: 796121200,
      payeeNumber: '00',
      personEntitled: 'AJHONS',
      deductionCode: '30',
      benefitType: 'Comp & Pen',
      diaryCode: '080',
      diaryCodeDescription: 'Referred to the Department of the Treasury',
      amountOverpaid: 0,
      amountWithheld: 0,
      originalAr: 136.24,
      currentAr: 100,
      debtHistory: [
        {
          date: '02/25/2009',
          letterCode: '914',
          description:
            'Paid In Full - Account balance cleared via offset, not including TOP.',
        },
        {
          date: '02/07/2009',
          letterCode: '905',
          description: 'Administrative Write Off',
        },
        {
          date: '12/03/2008',
          letterCode: '487',
          description: 'Death Case Pending Action',
        },
      ],
    },
    {
      fileNumber: 796121200,
      payeeNumber: '00',
      personEntitled: 'STUB_M',
      deductionCode: '44',
      benefitType: 'CH35 EDU',
      diaryCode: '100',
      diaryCodeDescription: 'Pending payment',
      amountOverpaid: 26000,
      amountWithheld: 0,
      originalAr: 100,
      currentAr: 80,
      debtHistory: [
        {
          date: '12/19/2014',
          letterCode: '681',
          description:
            'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
        },
        {
          date: '04/11/2013',
          letterCode: '080',
          description: 'Debt referred to Treasury for Cross servicing',
        },
        {
          date: '12/11/2012',
          letterCode: '510',
          description:
            'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
        },
        {
          date: '10/17/2012',
          letterCode: '212',
          description: 'Bad Address - Locator Request Sent',
        },
        {
          date: '09/28/2012',
          letterCode: '117',
          description: 'Second Demand Letter',
        },
        {
          date: '09/18/2012',
          letterCode: '100',
          description: 'First Demand Letter - Inactive Benefits - Due Process',
        },
      ],
    },
    {
      fileNumber: 796121200,
      payeeNumber: '00',
      personEntitled: 'AJOHNS',
      deductionCode: '71',
      benefitType: 'CH33 Books, Supplies/MISC EDU',
      diaryCode: '101',
      diaryCodeDescription: 'Pending automatic benefit offset',
      amountOverpaid: 0,
      amountWithheld: 0,
      originalAr: 166.67,
      currentAr: 120.4,
      debtHistory: [
        {
          date: '09/18/2012',
          letterCode: '100',
          description: 'First Demand Letter - Inactive Benefits - Due Process',
        },
      ],
    },
    {
      fileNumber: 796121200,
      payeeNumber: '00',
      personEntitled: 'AJOHNS',
      deductionCode: '74',
      benefitType: 'CH33 Student Tuition EDU',
      diaryCode: '117',
      diaryCodeDescription: 'Pending payment',
      amountOverpaid: 0,
      amountWithheld: 475,
      originalAr: 2210.9,
      currentAr: 1000,
      debtHistory: [
        {
          date: '04/01/2017',
          letterCode: 608,
          description: 'Full C&P Benefit Offset Notifi',
        },
        {
          date: '11/18/2015',
          letterCode: 130,
          description: 'Debt Increase - Due P',
        },
        {
          date: '04/08/2015',
          letterCode: 608,
          description: 'Full C&P Benefit Offset Notifi',
        },
        {
          date: '03/26/2015',
          letterCode: 100,
          description: 'First Demand Letter - Inactive Benefits - Due Process',
        },
      ],
    },
    {
      fileNumber: 796121200,
      payeeNumber: '00',
      personEntitled: 'AJHONS',
      deductionCode: '72',
      benefitType: 'CH33 Housing EDU',
      diaryCode: '123',
      diaryCodeDescription: 'Pending payment',
      amountOverpaid: 0,
      amountWithheld: 321.76,
      originalAr: 321.76,
      currentAr: 200,
      debtHistory: [
        {
          date: '08/08/2018',
          letterCode: 608,
          description: 'Full C&P Benefit Offset Notifi',
        },
        {
          date: '07/19/2018',
          letterCode: 100,
          description: 'First Demand Letter - Inactive Benefits - Due Process',
        },
      ],
    },
  ],
};

const debtLettersVBMS = [
  {
    documentId: '{64B0BDC4-D40C-4C54-86E0-104C987B8D8F}',
    docType: '1213',
    typeDescription: 'DMC - Second Demand Letter',
    receivedAt: '2020-05-26',
  },
  {
    documentId: '{70412535-E39E-4202-B24E-2751D9FBC874}',
    docType: '194',
    typeDescription: 'DMC - First Demand Letter',
    receivedAt: '2020-05-27',
  },
  {
    documentId: '{3626D232-98D9-41AB-AA3A-CD2DDF7DA59C}',
    docType: '194',
    typeDescription: 'DMC - First Demand Letter',
    receivedAt: '2020-05-28',
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
