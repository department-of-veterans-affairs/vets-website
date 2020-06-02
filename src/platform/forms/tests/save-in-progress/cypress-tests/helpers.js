const mockEnrollmentStatus = {
  applicationDate: '2018-01-24T00:00:00.000-06:00',
  enrollmentDate: '2018-01-24T00:00:00.000-06:00',
  preferredFacility: '987 - CHEY6',
  parsedStatus: 'none_of_the_above',
};

const mockInitSaveInProgress = {
  formData: {
    privacyAgreementAccepted: false,
    veteranSocialSecurityNumber: '123445544',
    veteranFullName: {},
    'view:placeOfBirth': {},
    'view:demographicCategories': {},
    isSpanishHispanicLatino: false,
    veteranAddress: {
      country: 'USA',
    },
    spouseFullName: {},
    isEssentialAcaCoverage: false,
    'view:preferredFacility': {},
    'view:locator': {},
  },
  metadata: {
    /* eslint-disable camelcase */
    version: 0,
    returnUrl: '/veteran-information/birth-information',
    savedAt: 1498588443698,
    expires_at: Cypress.moment()
      .add(1, 'day')
      .unix(),
    last_updated: 1498588443,
    /* eslint-enable camelcase */
  },
};

const mockSaveInProgress = {
  data: {
    attributes: {
      metadata: {
        /* eslint-disable camelcase */
        version: 0,
        returnUrl: '/veteran-information/birth-information',
        savedAt: 1498588443698,
        expires_at: Cypress.moment()
          .add(1, 'day')
          .unix(),
        last_updated: 1498588443,
        /* eslint-enable camelcase */
      },
    },
  },
};

module.exports = {
  mockEnrollmentStatus,
  mockInitSaveInProgress,
  mockSaveInProgress,
};
