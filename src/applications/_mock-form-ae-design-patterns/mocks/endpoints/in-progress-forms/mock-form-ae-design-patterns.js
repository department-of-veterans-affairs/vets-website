const prefill = {
  formData: {
    data: {
      attributes: {
        veteran: {
          address: {
            addressLine1: '623 Lesser Dr',
            city: 'Fort Collins',
            stateCode: 'CO',
            zipCode5: '80524',
            countryName: 'USA',
          },
          firstName: 'John',
          lastName: 'Donut',
          middleName: 'Jelly',
          phone: {
            areaCode: '970',
            phoneNumber: '5561289',
          },
          emailAddressText: 'sample@email.com',
          ssn: '3607',
        },
        'view:maritalStatus': { maritalStatus: 'MARRIED' },
        spouseFullName: { first: 'Michelle', last: 'Smith' },
        spouseDateOfBirth: '1990-08-03',
        spouseSocialSecurityNumber: '451906574',
        'view:reportDependents': true,
        'view:skipDependentInfo': false,
        dependents: [
          {
            fullName: { first: 'Mia', last: 'Smith' },
            dependentRelation: 'Daughter',
          },
        ],
      },
    },
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
  createSaveInProgressUpdate,
  createSaveInProgressUpdateTaskPurple,
  createSaveInProgressUpdateEZR,
};
