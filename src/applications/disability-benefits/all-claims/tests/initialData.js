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
      maximumRatingPercentage: 40,
      specialIssues: ['PTSD/1'],
      disabilityActionType: 'NONE',
    },
    {
      diagnosticCode: 5678,
      decisionCode: 'SVCCONNCTED',
      name: 'Intervertebral disc syndrome',
      ratedDisabilityId: '1231231',
      ratingPercentage: 0,
      ratingDecisionId: '63456',
      specialIssues: [],
      disabilityActionType: 'NONE',
    },
    {
      diagnosticCode: 8100,
      decisionCode: 'SVCCONNCTED',
      name: 'Migraines',
      ratedDisabilityId: '1231232',
      ratingPercentage: 100,
      ratingDecisionId: '63457',
      specialIssues: [],
      disabilityActionType: 'NONE',
    },
  ],
  newDisabilities: [
    {
      cause: 'NEW',
      primaryDescription:
        'Lorem neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      condition: 'CAD',
    },
    {
      cause: 'NEW',
      primaryDescription:
        'Lorem neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      condition: 'cancer',
    },
  ],
};
