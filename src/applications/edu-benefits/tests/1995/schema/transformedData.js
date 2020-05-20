const transformedMinimalDataActual = {
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    city: 'Test',
    country: 'USA',
    state: 'TN',
    postalCode: '22312',
  },
  email: 'test2@test1.net',
  educationType: 'correspondence',
  veteranFullName: {
    first: 'asdf',
    last: 'asdf',
  },
  veteranSocialSecurityNumber: '123333333',
  oldSchool: {},
  privacyAgreementAccepted: true,
  newSchool: {
    name: 'Test',
  },
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  bankAccountChange: 'startUpdate',
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '12345',
  },
  preferredContactMethod: 'mail',
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    city: 'Test',
    country: 'USA',
    state: 'TN',
    postalCode: '22312',
  },
  email: 'test2@test1.net',
  homePhone: '4445551212',
  mobilePhone: '4445551213',
  educationType: 'correspondence',
  educationObjective: 'Education or career goal',
  nonVaAssistance: true,
  civilianBenefitsAssistance: true,
  oldSchool: {
    name: 'Old Test School',
    address: {
      street: '321 Test St',
      street2: 'On the second floor',
      city: 'Terst',
      country: 'USA',
      state: 'TN',
      postalCode: '54321',
    },
  },
  trainingEndDate: '2018-03-02',
  reasonForChange: 'Stop reason',
  benefit: 'chapter33',
  veteranFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
    suffix: 'IV',
  },
  veteranSocialSecurityNumber: '123333333',
  privacyAgreementAccepted: true,
  newSchool: {
    name: 'Test',
    address: {
      street: '123 Test St',
      street2: 'Below ground',
      city: 'Test',
      country: 'USA',
      state: 'TN',
      postalCode: '12345',
    },
  },
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
