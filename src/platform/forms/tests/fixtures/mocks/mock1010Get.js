import moment from 'moment';
/* eslint-disable camelcase */

const mock1010Get = {
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
    version: 0,
    returnUrl: '/veteran-information/birth-information',
    savedAt: 1498588443698,
    expires_at: moment()
      .add(1, 'day')
      .unix(),
    last_updated: 1498588443,
  },
};

export default mock1010Get;
