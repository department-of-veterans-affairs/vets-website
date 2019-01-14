export const transformedMinimalData = {
  form526: {
    hasTrainingPay: false,
    isVAEmployee: false,
    homelessOrAtRisk: 'no',
    phoneAndEmail: {
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
    hasTrainingPay: true,
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
    phoneAndEmail: {
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
    newPrimaryDisabilities: [
      {
        cause: 'NEW',
        primaryDescription: 'A thing happened.',
        condition: 'PTSD (post traumatic stress disorder)',
        specialIssues: ['POW'],
      },
      {
        cause: 'NEW',
        primaryDescription: 'A thing happened.',
        condition: 'Some condition',
      },
      {
        cause: 'WORSENED',
        primaryDescription: 'A thing happened.',
        condition: 'Some fourth condition',
      },
    ],
    newSecondaryDisabilities: [
      {
        cause: 'SECONDARY',
        primaryDescription: 'A thing happened.',
        condition: 'Some other condition',
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
        disabilityActionType: 'NONE',
      },
      {
        name: 'Third Condition',
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
    form0781: {
      remarks: '781 Remarks',
      additionalIncidentText: 'Additional incident text',
      additionalSecondaryIncidentText: 'Additional secondary incident text',
      otherInformation: [
        'Increased visits to a medical or counseling clinic or dispensary, even without a specific diagnosis or specific ailment',
        'Other physical change',
        'Withdrawal from friends',
        'Unexplained social behavior changes',
        'Other social change',
        'Episodes of depression, panic attacks, or anxiety without an identifiable cause',
        'Increased fear of surroundings, inability to go to certain areas',
        'Hypervigilance, heightened fight or flight response',
        'Other mental change',
        'Changes in performance and performance evaluations',
        'Resigning from your job',
        'Other work change',
        'Additional changes test',
      ],
      incidents: [
        {
          personalAssault: false,
          medalsCitations: 'Medal A and Medal B',
          incidentDate: '1992-03-04',
          incidentLocation:
            'Test, MS, USA, Additional first incident location details',
          incidentDescription: 'First PTSD event description',
          unitAssigned: 'Division 1',
          unitAssignedDates: {
            from: '1991-03-03',
            to: '1996-03-06',
          },
          personsInvolved: [
            {
              name: {
                first: 'John',
              },
              rank: 'Sgt',
              injuryDeath: 'injuredNonBattle',
              injuryDeathDate: '1992-07-03',
              unitAssigned: 'Unit B',
              description: 'John H Doe description',
            },
          ],
        },
        {
          personalAssault: false,
          medalsCitations: 'Medal B',
          incidentDate: '1992-01-01',
          incidentLocation: 'Test, TN, USA, Other',
          incidentDescription: 'Incident description',
          unitAssigned: 'Unit A',
          unitAssignedDates: {
            from: '1990-01-01',
            to: '1999-01-01',
          },
        },
        {
          personalAssault: false,
          medalsCitations: 'Medal C',
          incidentDate: '1992-01-01',
          incidentLocation: 'Test, TN, USA, Other',
          incidentDescription: 'Incident description',
          unitAssigned: 'Unit A',
          unitAssignedDates: {
            from: '1990-01-01',
            to: '1999-01-01',
          },
          personsInvolved: [
            {
              name: {
                first: 'John',
                last: 'Doe',
              },
              rank: 'Private',
              injuryDeath: 'other',
              injuryDeathOther: 'Other text',
              injuryDeathDate: '1992-01-01',
              unitAssigned: 'Unit A',
            },
            {
              name: {
                first: 'Jane',
                last: 'Doe',
              },
            },
          ],
        },
        {
          personalAssault: true,
          incidentDate: '1994-04-03',
          incidentLocation:
            'City Name, AZ, USA, First 781a PTSD incident location additional details',
          incidentDescription: 'First 781a PTSD incident description',
          unitAssigned: 'Unit Name',
          unitAssignedDates: {
            from: '1992-02-16',
            to: '1995-04-04',
          },
          sources: [
            {
              address: {
                addressLine1: '123 Test St',
                city: 'Test',
                country: 'USA',
                state: 'PA',
                zipCode: '12345',
              },
              name: 'Police',
            },
          ],
        },
        {
          personalAssault: true,
          incidentDate: '1992-01-01',
          incidentLocation: 'Test, TN, USA, Other',
          incidentDescription: 'Second 781a PTSD incident description',
          unitAssigned: 'Unit A',
          unitAssignedDates: {
            from: '1990-01-01',
            to: '1999-01-01',
          },
        },
        {
          personalAssault: true,
          incidentDate: '1992-01-01',
          incidentLocation: 'Test, TN, USA, Other',
          incidentDescription: 'Third 781a PTSD incident description',
          unitAssigned: 'Unit A',
          unitAssignedDates: {
            from: '1990-01-01',
            to: '1999-01-01',
          },
        },
      ],
    },
    attachments: [
      {
        attachmentId: 'L048',
        confirmationCode: '354c6d40-b6f5-8c6d-9393-3b7de24569e94',
        name: 'Doc.pdf',
      },
      {
        attachmentId: 'L015',
        confirmationCode: '354c6d40-b7f5-4c6d-9393-3b2de6969e94',
        name: 'Document Name',
      },
      {
        attachmentId: 'L034',
        confirmationCode: '354c6d40-b7f5-4c6d-9393-3b2da24569e94',
        name: 'Doc.pdf',
      },
      {
        attachmentId: 'L015',
        confirmationCode: '354c6d40-b7f5-4c6d-9393-3b2de24569e94',
        name: 'Doc.pdf',
      },
      {
        attachmentId: 'L048',
        confirmationCode: '354c6d40-b6f5-4c6d-9393-3b7de24569e94',
        name: 'Doc.pdf',
      },
    ],
  },
};

export const transformedMinimalPtsdFormUploadData = {
  form526: {
    standardClaim: true,
    hasTrainingPay: false,
    isVAEmployee: false,
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
      { condition: 'PTSD personal trauma', cause: 'NEW' },
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
