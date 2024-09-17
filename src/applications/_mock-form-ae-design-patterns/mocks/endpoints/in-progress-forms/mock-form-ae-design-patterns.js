const prefill = {
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

const createSaveInProgressUpdate = () => {
  const now = new Date().toISOString();

  return {
    data: {
      id: '',
      type: 'in_progress_forms',
      attributes: {
        formId: 'FORM-MOCK-AE-DESIGN-PATTERNS',
        createdAt: '2024-08-14T22:19:19.035Z',
        updatedAt: now,
        metadata: {
          version: 0,
          returnUrl: '/task-green/veteran-information/confirm-mailing-address',
          savedAt: Date.now(),
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          createdAt: Math.floor(Date.now() / 1000),
          expiresAt: Math.floor(Date.now() / 1000) + 5184000, // Current time + 60 days in seconds
          lastUpdated: Math.floor(Date.now() / 1000),
          inProgressFormId: 34920,
        },
      },
    },
  };
};

const createSaveInProgressUpdateTaskPurple = () => {
  const now = new Date().toISOString();

  return {
    data: {
      id: '',
      type: 'in_progress_forms',
      attributes: {
        formId: 'FORM-MOCK-AE-DESIGN-PATTERNS',
        createdAt: '2024-08-14T22:19:19.035Z',
        updatedAt: now,
        metadata: {
          version: 0,
          returnUrl: '/task-purple/veteran-information',
          savedAt: Date.now(),
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          createdAt: Math.floor(Date.now() / 1000),
          expiresAt: Math.floor(Date.now() / 1000) + 5184000, // Current time + 60 days in seconds
          lastUpdated: Math.floor(Date.now() / 1000),
          inProgressFormId: 34920,
        },
      },
    },
  };
};

const createSaveInProgressUpdateEZR = () => {
  const now = new Date().toISOString();

  return {
    data: {
      id: '',
      type: 'in_progress_forms',
      attributes: {
        formId: 'FORM-MOCK-AE-DESIGN-PATTERNS',
        createdAt: '2024-08-14T22:19:19.035Z',
        updatedAt: now,
        metadata: {
          version: 0,
          // returnUrl: '1/ezr/household-information/dependents',
          returnUrl: '/1/ezr/household-information/spouse-personal-information',
          savedAt: Date.now(),
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          createdAt: Math.floor(Date.now() / 1000),
          expiresAt: Math.floor(Date.now() / 1000) + 5184000, // Current time + 60 days in seconds
          lastUpdated: Math.floor(Date.now() / 1000),
          inProgressFormId: 34920,
        },
      },
    },
  };
};

module.exports = {
  prefill,
  prefillMaximal,
  createSaveInProgressUpdate,
  createSaveInProgressUpdateTaskPurple,
  createSaveInProgressUpdateEZR,
};
