export const transformedMinimalData = {
  form526: {
    hasTrainingPay: false,
    isVAEmployee: false,
    homelessOrAtRisk: 'no',
    phoneEmailCard: {
      primaryPhone: '1231231234',
      emailAddress: 'asdf@as.asdf',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: 'asdf',
      city: 'asdf',
      state: 'AL',
      zipCode: '19234',
    },
    ratedDisabilities: [
      {
        name: 'First Condition',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
    ],
    serviceInformation: {
      servicePeriods: [
        {
          serviceBranch: 'Air Force',
          dateRange: {
            from: '1900-01-01',
            to: '1901-01-01',
          },
        },
      ],
    },
    standardClaim: false,
  },
};

export const transformedMaximalData = {
  form526: {
    standardClaim: false,
    separationPayDate: '2019-01-01',
    separationPayBranch: 'Air Force',
    waiveTrainingPay: true,
    waiveRetirementPay: false,
    isVAEmployee: true,
    homelessOrAtRisk: 'atRisk',
    atRiskHousingSituation: 'other',
    otherAtRiskHousing: 'Situation description',
    homelessnessContact: { name: 'Name', phoneNumber: '1231231234' },
    bankAccountType: 'Checking',
    bankAccountNumber: '1233',
    bankRoutingNumber: '123412345',
    bankName: 'BigBank Name',
    phoneEmailCard: {
      primaryPhone: '1231231234',
      emailAddress: 'asdf@adsf.asdf',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: 'asdf',
      addressLine2: 'line 2',
      addressLine3: 'line 3',
      city: 'asdf',
      state: 'AL',
      zipCode: '19234',
    },
    forwardingAddress: {
      country: 'USA',
      addressLine1: 'adsf',
      addressLine2: 'line 2',
      addressLine3: 'line 3',
      city: 'asdf',
      state: 'OH',
      zipCode: '12343',
      effectiveDate: {
        from: '2019-01-01',
        to: '2020-01-01',
      },
    },
    additionalDocuments: [
      {
        confirmationCode: '354c6d40-b7f5-4c6d-9393-3b2de6969e94',
        attachmentId: 'L015',
        name: 'Document Name',
      },
    ],
    vaTreatmentFacilities: [
      {
        treatmentCenterName: 'VA Clinic Name',
        treatmentDateRange: {
          from: '1904-01-01',
          to: '1905-01-01',
        },
        treatmentCenterAddress: {
          country: 'USA',
          city: 'asdf',
          state: 'AL',
        },
        treatedDisabilityNames: [
          'first condition',
          'ptsd (post traumatic stress disorder)',
        ],
      },
    ],
    confinements: [
      {
        from: '1900-01-01',
        to: '1901-01-01',
      },
    ],
    newDisabilities: [
      {
        cause: 'NEW',
        primaryDescription: 'A thing happened.',
        condition: 'PTSD (post traumatic stress disorder)',
        specialIssues: ['POW'],
      },
    ],
    ratedDisabilities: [
      {
        name: 'First Condition',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
      {
        name: 'Second Condition',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 0,
        disabilityActionType: 'INCREASE',
      },
      {
        name: 'Third Condition',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
    ],
    serviceInformation: {
      reservesNationalGuardService: {
        obligationTermOfServiceDateRange: {
          from: '1902-01-01',
          to: '1903-01-01',
        },
        title10Activation: {
          title10ActivationDate: '1902-01-01',
          anticipatedSeparationDate: '2019-01-01',
        },
        unitName: 'RNG Unit 1',
        unitAddress: {
          country: 'USA',
          addressLine1: 'asdf',
          addressLine2: 'second line',
          addressLine3: 'third line',
          city: 'asdf',
          state: 'AL',
          zipCode: '19234',
        },
        unitPhone: '1231231234',
      },
      servicePeriods: [
        {
          serviceBranch: 'Air Force',
          dateRange: {
            from: '1900-01-01',
            to: '1901-01-01',
          },
        },
        {
          serviceBranch: 'Air National Guard',
          dateRange: {
            from: '1902-01-01',
            to: '1903-01-01',
          },
        },
      ],
    },
    militaryRetiredPayBranch: 'Air Force',
    alternateNames: [
      {
        first: 'Old',
        last: 'Name',
      },
      {
        first: 'Another',
        middle: 'Old',
        last: 'Name',
      },
    ],
    privacyAgreementAccepted: true,
  },
};
