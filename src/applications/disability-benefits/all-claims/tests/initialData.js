export default {
  fullName: {
    first: 'Sally',
    last: 'Alphonse',
  },
  socialSecurityNumber: '234234234',
  vaFileNumber: '345345345',
  gender: 'F',
  dateOfBirth: '1990-04-02',
  directDeposit: {
    accountType: 'CHECKING',
    accountNumber: '234234234',
    routingNumber: '234234234',
    bankName: 'Local bank',
  },
  veteran: {
    primaryPhone: '2342342342',
    secondaryPhone: '3242342342',
    emailAddress: 'test@test.com',
    mailingAddress: {
      country: 'USA',
      city: 'Detroit',
      state: 'MI',
      zipCode: '234563453',
      addressLine1: '234 Maple St.',
    },
  },
  servicePeriods: [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '1990-02-02',
        to: '2010-03-04',
      },
    },
  ],
  ratedDisabilities: [
    {
      diagnosticCode: 5420,
      decisionCode: 'SVCCONNCTED',
      name: 'Post traumatic stress disorder',
      ratedDisabilityId: '9459392',
      ratingDecisionId: '63655',
      ratingPercentage: 40,
      specialIssues: [
        {
          code: 'TRM',
          name: 'Personal Trauma PTSD',
        },
      ],
    },
    {
      diagnosticCode: 5678,
      decisionCode: 'SVCCONNCTED',
      name: 'Intervertebral disc syndrome',
      ratedDisabilityId: '1231231',
      ratingPercentage: 0,
      ratingDecisionId: '63456',
      specialIssues: [],
    },
  ],
  incident0: {
    medalsCitations: 'Medal A',
    incidentDate: '1992-01-01',
    incidentLocation: 'Location',
    incidentDescription: 'Incident description',
    unitAssigned: 'Unit A',
    unitAssignedDates: {
      from: '1990-01-01',
      to: '1999-01-01',
    },
    remarks: 'Remarks text',
    personInvolved: [
      {
        first: 'John',
        last: 'Doe',
        rank: 'Private',
        injuryDeath: 'Other',
        injuryDeathOther: 'Other text',
        injuryDeathDate: '1992-1-1',
        unitAssigned: 'Unit A',
      },
      {
        first: 'Jane',
        last: 'Doe',
      },
    ],
    source: [
      {
        name: 'Source Name',
        address: {
          country: 'USA',
          city: 'Detroit',
          state: 'MI',
          zipCode: '234563453',
          addressLine1: '234 Maple St.',
        },
      },
    ],
  },
  incident1: {
    incidentLocation: 'Location',
  },
  incident2: {
    incidentLocation: 'Location',
  },
  secondaryIncident0: {
    incidentLocation: 'Location',
  },
  secondaryIncident1: {
    incidentLocation: 'Location',
  },
  secondaryIncident2: {
    incidentLocation: 'Location',
  },
};
