const transformedMinimalDataActual = {
  isActiveDuty: true,
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '12345',
  },
  veteranAddress: {
    street: 'MILITARY ADDY 3',
    city: 'Test',
    country: 'USA',
    state: 'TN',
    postalCode: '22312',
  },
  email: 'test2@test1.net',
  mobilePhone: '4445551213',
  veteranFullName: {
    first: 'Min',
    last: 'asdf',
  },
  veteranSocialSecurityNumber: '123333333',
  privacyAgreementAccepted: true,
  isEnrolledStem: true,
  isPursuingTeachingCert: true,
  benefitLeft: 'none',
  degreeName: '0',
  schoolName: 'TEST SCHOOL',
  schoolCity: 'TEST',
  schoolCountry: 'ALB',
  benefit: 'chapter33',
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  isActiveDuty: true,
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '12345',
  },
  preferredContactMethod: 'mobilePhone',
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
  veteranFullName: {
    first: 'Max',
    middle: 'A',
    last: 'Anderson',
    suffix: 'IV',
  },
  veteranSocialSecurityNumber: '123333333',
  privacyAgreementAccepted: true,
  isEnrolledStem: true,
  isPursuingTeachingCert: true,
  benefitLeft: 'none',
  degreeName: '0',
  schoolName: 'TEST SCHOOL',
  schoolCity: 'TEST',
  schoolState: 'MA',
  schoolCountry: 'USA',
  benefit: 'chapter33',
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
