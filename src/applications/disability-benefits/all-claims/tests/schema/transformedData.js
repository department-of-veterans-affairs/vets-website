export const transformedMinimalData = {
  form526: {
    isVaEmployee: false,
    homelessOrAtRisk: 'no',
    phoneAndEmail: {
      primaryPhone: '4445551212',
      emailAddress: 'test2@test1.net',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: '123 Main',
      city: 'Bigcity',
      state: 'AK',
      zipCode: '12345',
    },
    ratedDisabilities: [
      {
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
      {
        name: 'Diabetes mellitus1',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
    serviceInformation: {
      reservesNationalGuardService: {
        obligationTermOfServiceDateRange: {
          from: '2007-05-22',
          to: '2008-06-05',
        },
        unitName: 'Unit name here',
      },
      servicePeriods: [
        {
          serviceBranch: 'Air Force Reserve',
          dateRange: { from: '2001-03-21', to: '2014-07-21' },
        },
      ],
    },
    servedInCombatZonePost911: false,
    standardClaim: false,
  },
};

export const transformedMaximalData = {
  form526: {
    standardClaim: false,
    waiveTrainingPay: true,
    waiveRetirementPay: true,
    isVaEmployee: true,
    homelessOrAtRisk: 'homeless',
    homelessHousingSituation: 'other',
    otherHomelessHousing: 'Under a bridge',
    needToLeaveHousing: true,
    homelessnessContact: { name: 'Name Here', phoneNumber: '1231231234' },
    bankAccountType: 'Checking',
    bankAccountNumber: '1233',
    bankRoutingNumber: '123123123',
    bankName: 'Bigbank Co.',
    phoneAndEmail: {
      primaryPhone: '4445551212',
      emailAddress: 'test2@test1.net',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: '123 Main',
      city: 'Bigcity',
      state: 'AK',
      zipCode: '12345',
    },
    forwardingAddress: {
      country: 'USA',
      addressLine1: '321 Secondary',
      city: 'Smallcity',
      state: 'NY',
      zipCode: '54321',
      effectiveDate: { from: '2099-12-01', to: '2100-01-01' },
    },
    vaTreatmentFacilities: [
      {
        treatmentCenterName: 'Treatment Center the First',
        treatmentDateRange: { from: '2008-01-XX', to: '2010-01-XX' },
        treatmentCenterAddress: {
          country: 'USA',
          city: 'Bigcity',
          state: 'AK',
        },
        treatedDisabilityNames: [
          'Diabetes mellitus0',
          'Diabetes mellitus1',
          'myocardial infarction (MI)',
        ],
      },
      {
        treatmentCenterName: 'Treatment Center the Second',
        treatmentDateRange: { from: '2010-01-XX', to: '2018-02-XX' },
        treatmentCenterAddress: { country: 'Uganda', city: 'Ugandan City' },
        treatedDisabilityNames: ['asthma', 'phlebitis', 'knee replacement'],
      },
    ],
    confinements: [
      { from: '2016-01-01', to: '2017-01-01' },
      { from: '2017-01-06', to: '2017-04-01' },
    ],
    ratedDisabilities: [
      {
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
      {
        name: 'Diabetes mellitus1',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'INCREASE',
      },
      {
        name: 'De-selected',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
      {
        name: 'Not selected',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
    hasTrainingPay: true,
    militaryRetiredPayBranch: 'Air Force',
    separationPayDate: '2018-XX-XX',
    separationPayBranch: 'Air Force',
    serviceInformation: {
      reservesNationalGuardService: {
        title10Activation: {
          title10ActivationDate: '2015-01-01',
          anticipatedSeparationDate: '2120-01-01',
        },
        obligationTermOfServiceDateRange: {
          from: '2007-05-22',
          to: '2008-06-05',
        },
        unitName: 'Seal Team Six',
      },
      servicePeriods: [
        {
          serviceBranch: 'Air Force Reserve',
          dateRange: { from: '2001-03-21', to: '2014-07-21' },
        },
        {
          serviceBranch: 'Air National Guard',
          dateRange: { from: '2015-01-01', to: '2017-05-13' },
        },
      ],
    },
    servedInCombatZonePost911: true,
    alternateNames: [
      { first: 'William', middle: 'Schwenk', last: 'Gilbert' },
      { first: 'Arthur', last: 'Sullivan' },
    ],
    newPrimaryDisabilities: [
      {
        cause: 'NEW',
        primaryDescription:
          'It makes no sense for this particular condition, but hey, this is only test data.',
        condition: 'asthma',
        classificationCode: '540',
      },
      {
        cause: 'WORSENED',
        worsenedDescription: 'My knee was strained in the service',
        worsenedEffects:
          "It wasn't great before, but it got bad enough I needed a replacement. Now I have to take medication for it. I think. That makes sense, right?",
        condition: 'knee replacement',
        specialIssues: ['POW'],
        classificationCode: '8919',
      },
      {
        cause: 'VA',
        vaMistreatmentDescription: 'A thing happened.',
        vaMistreatmentLocation: 'Somewhereville',
        vaMistreatmentDate: 'A while ago',
        condition: 'myocardial infarction (MI)',
        specialIssues: ['POW'],
        classificationCode: '4440',
      },
    ],
    newSecondaryDisabilities: [
      {
        cause: 'SECONDARY',
        causedByDisability: 'Diabetes mellitus0',
        causedByDisabilityDescription: "Again, this doesn't really make sense.",
        condition: 'phlebitis',
        classificationCode: '5300',
      },
    ],
    attachments: [
      {
        name: 'AngleSettingJig_9_25_15.pdf',
        confirmationCode: '544f14cc-4e51-4661-b8f4-d79f71567491',
        attachmentId: 'L107',
      },
      {
        name: 'image.png',
        confirmationCode: 'fa0c0f47-a42f-4bbc-88f3-873c5bea6ce7',
        attachmentId: 'L023',
      },
      {
        name: 'lolwut.png',
        confirmationCode: '552067b2-9c5d-4bd8-bcd8-bc621b51a145',
        attachmentId: 'L015',
      },
      {
        name: 'image (1).png',
        confirmationCode: '0496e5c2-0675-4a43-83d6-e1eeabd4ea0e',
        attachmentId: 'L070',
      },
      {
        name: 'Success.jpg',
        confirmationCode: 'de89492d-2d3f-4486-a73d-1fa4868aa49d',
        attachmentId: 'L023',
      },
    ],
  },
};

export const transformedNewSecondaryData = {
  form526: {
    standardClaim: false,
    waiveTrainingPay: true,
    waiveRetirementPay: true,
    isVaEmployee: true,
    homelessOrAtRisk: 'homeless',
    homelessHousingSituation: 'other',
    otherHomelessHousing: 'Under a bridge',
    needToLeaveHousing: true,
    homelessnessContact: { name: 'Name Here', phoneNumber: '1231231234' },
    bankAccountType: 'Checking',
    bankAccountNumber: '1233',
    bankRoutingNumber: '123123123',
    bankName: 'Bigbank Co.',
    phoneAndEmail: {
      primaryPhone: '4445551212',
      emailAddress: 'test2@test1.net',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: '123 Main',
      city: 'Bigcity',
      state: 'AK',
      zipCode: '12345',
    },
    forwardingAddress: {
      country: 'USA',
      addressLine1: '321 Secondary',
      city: 'Smallcity',
      state: 'NY',
      zipCode: '54321',
      effectiveDate: { from: '2099-12-01', to: '2100-01-01' },
    },
    vaTreatmentFacilities: [
      {
        treatmentCenterName: 'Treatment Center the First',
        treatmentDateRange: { from: '2008-01-XX', to: '2010-01-XX' },
        treatmentCenterAddress: {
          country: 'USA',
          city: 'Bigcity',
          state: 'AK',
        },
        treatedDisabilityNames: ['Diabetes mellitus0', 'De-selected'],
      },
    ],
    ratedDisabilities: [
      {
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
      {
        name: 'Diabetes mellitus1',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
      {
        name: 'De-selected',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
      {
        name: 'Not selected',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
    hasTrainingPay: true,
    militaryRetiredPayBranch: 'Air Force',
    separationPayDate: '2018-XX-XX',
    separationPayBranch: 'Air Force',
    serviceInformation: {
      reservesNationalGuardService: {
        title10Activation: {
          title10ActivationDate: '2015-01-01',
          anticipatedSeparationDate: '2120-01-01',
        },
        obligationTermOfServiceDateRange: {
          from: '2007-05-22',
          to: '2008-06-05',
        },
        unitName: 'Seal Team Six',
      },
      servicePeriods: [
        {
          serviceBranch: 'Air Force Reserve',
          dateRange: { from: '2001-03-21', to: '2014-07-21' },
        },
        {
          serviceBranch: 'Air National Guard',
          dateRange: { from: '2015-01-01', to: '2017-05-13' },
        },
      ],
    },
    servedInCombatZonePost911: true,
    alternateNames: [
      { first: 'William', middle: 'Schwenk', last: 'Gilbert' },
      { first: 'Arthur', last: 'Sullivan' },
    ],
    newSecondaryDisabilities: [
      {
        cause: 'SECONDARY',
        causedByDisability: 'Diabetes mellitus0',
        causedByDisabilityDescription: "Again, this doesn't really make sense.",
        condition: 'phlebitis',
        classificationCode: '5300',
      },
      {
        cause: 'SECONDARY',
        causedByDisability: 'De-selected',
        causedByDisabilityDescription: "Again, this doesn't really make sense.",
        condition: 'knee replacement',
        classificationCode: '8919',
      },
    ],
    attachments: [
      {
        name: 'AngleSettingJig_9_25_15.pdf',
        confirmationCode: '544f14cc-4e51-4661-b8f4-d79f71567491',
        attachmentId: 'L107',
      },
      {
        name: 'image.png',
        confirmationCode: 'fa0c0f47-a42f-4bbc-88f3-873c5bea6ce7',
        attachmentId: 'L023',
      },
      {
        name: 'lolwut.png',
        confirmationCode: '552067b2-9c5d-4bd8-bcd8-bc621b51a145',
        attachmentId: 'L015',
      },
      {
        name: 'image (1).png',
        confirmationCode: '0496e5c2-0675-4a43-83d6-e1eeabd4ea0e',
        attachmentId: 'L070',
      },
      {
        name: 'Success.jpg',
        confirmationCode: 'de89492d-2d3f-4486-a73d-1fa4868aa49d',
        attachmentId: 'L023',
      },
    ],
  },
};

export const transformedMinimalPtsdFormUploadData = {
  form526: {
    standardClaim: true,
    hasTrainingPay: false,
    isVaEmployee: false,
    homelessOrAtRisk: 'no',
    phoneAndEmail: {
      primaryPhone: '8035555555',
      emailAddress: 'bill@gmail.com',
    },
    mailingAddress: {
      country: 'USA',
      addressLine1: '100 cool ln.',
      city: 'Charleston',
      state: 'SC',
      zipCode: '29412',
    },
    serviceInformation: {
      reservesNationalGuardService: {
        obligationTermOfServiceDateRange: {
          from: '2007-05-22',
          to: '2008-06-05',
        },
        unitName: 'billy',
      },
      servicePeriods: [
        {
          serviceBranch: 'Air Force Reserve',
          dateRange: { from: '2001-03-21', to: '2014-07-21' },
        },
      ],
    },
    servedInCombatZonePost911: false,
    ratedDisabilities: [
      {
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
      {
        name: 'Diabetes mellitus1',
        ratedDisabilityId: '1',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
    primaryPhone: '4445551212',
    emailAddress: 'test2@test1.net',
    privacyAgreementAccepted: true,
    newPrimaryDisabilities: [
      {
        condition: 'PTSD personal trauma',
        cause: 'NEW',
        classificationCode: '7290',
      },
    ],
    attachments: [
      {
        name: '781Form.pdf',
        confirmationCode: 'c22924e2-3024-450b-8182-46df6e189060',
        attachmentId: 'L228',
      },
      {
        name: '781aForm.pdf',
        confirmationCode: 'a9915db8-5083-4a68-9372-35404f0c56dc',
        attachmentId: 'L229',
      },
    ],
  },
};
