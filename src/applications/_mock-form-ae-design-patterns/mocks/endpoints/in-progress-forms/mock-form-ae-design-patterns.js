const prefill = {
  formData: {
    veteranFullName: {
      first: 'Mitchell',
      middle: 'George',
      last: 'Jenkins',
    },
    gender: 'M',
    veteranDateOfBirth: '1950-11-18',
    veteranSocialSecurityNumber: '123456789',
    homePhone: '6575107441',
    email: 'vets.gov.user+71@gmail.com',
    'view:maritalStatus': { maritalStatus: 'MARRIED' },
    spouseFullName: { first: 'Michelle', last: 'Smith' },
    spouseDateOfBirth: '1984-08-03',
    spouseSocialSecurityNumber: '451906574',
    maritalStatus: 'Married',
    dateOfMarriage: '2020-10-15',
    cohabitedLastYear: true,
    'view:reportDependents': true,
    'view:skipDependentInfo': false,
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: true,
    medicarePartAEffectiveDate: '2009-01-02',
    medicareClaimNumber: '7AD5WC9MW60',
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-details',
  },
};

// contains prefill for dependents and insurance providers info
const prefillMaximal = {
  formData: {
    veteranFullName: { first: 'Julio', middle: 'E', last: 'Hunter' },
    gender: 'M',
    veteranDateOfBirth: '1950-11-18',
    veteranSocialSecurityNumber: '796378321',
    homePhone: '6575107441',
    email: 'vets.gov.user+71@gmail.com',
    'view:maritalStatus': { maritalStatus: 'MARRIED' },
    spouseFullName: { first: 'Michelle', last: 'Smith' },
    spouseDateOfBirth: '1984-08-03',
    spouseSocialSecurityNumber: '451906574',
    maritalStatus: 'Married',
    dateOfMarriage: '2020-10-15',
    cohabitedLastYear: true,
    'view:reportDependents': true,
    'view:skipDependentInfo': false,
    dependents: [
      {
        fullName: { first: 'Mia', last: 'Smith' },
        socialSecurityNumber: '234114455',
        dependentRelation: 'Daughter',
        disabledBefore18: false,
        attendedSchoolLastYear: false,
        cohabitedLastYear: true,
      },
    ],
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: false,
    'view:addInsurancePolicy': true,
    'view:skipInsuranceInfo': false,
    providers: [
      {
        insuranceName: 'Aetna',
        insurancePolicyHolderName: 'Four IVMTEST',
        'view:policyOrGroup': {
          insurancePolicyNumber: '006655',
          insuranceGroupCode: '123456',
        },
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-details',
  },
};

module.exports = {
  prefill,
  prefillMaximal,
};
