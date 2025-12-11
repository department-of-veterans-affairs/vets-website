const mock = require('../../../platform/testing/e2e/mock-helpers');

const enrollmentData = {
  data: {
    id: '',
    type: 'ch33_status',
    attributes: {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1988-03-01',
      vaFileNumber: '374374377',
      regionalProcessingOffice: 'Muskogee, OK',
      eligibilityDate: '2005-04-01',
      delimitingDate: null,
      percentageBenefit: 100,
      activeDuty: true,
      veteranIsEligible: true,
      originalEntitlement: {
        months: 36,
        days: 0,
      },
      usedEntitlement: {
        months: 22,
        days: 3,
      },
      remainingEntitlement: {
        months: 0,
        days: 0,
      },
      entitlementTransferredOut: {
        months: 14,
        days: 0,
      },
    },
  },
};

const backendStatus = {
  data: {
    id: '',
    type: 'backend_statuses',
    attributes: {
      name: 'gibs',
      isAvailable: true,
    },
  },
};

// Create API routes
function initApplicationMock(token) {
  mock(token, {
    path: '/v0/post911_gi_bill_status',
    verb: 'get',
    value: enrollmentData,
  });

  mock(token, {
    path: '/v0/backend_statuses/gibs',
    verb: 'get',
    value: backendStatus,
  });

  mock(token, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [],
      },
    },
  });
}

module.exports = {
  enrollmentData,
  initApplicationMock,
};
