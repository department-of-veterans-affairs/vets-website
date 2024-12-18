const {
  USER,
  FULL_NAME,
  HOME_PHONE_FULL,
  MOBILE_PHONE_FULL,
} = require('../../constants/user');

const response = {
  formData: {
    veteranFullName: FULL_NAME,
    gender: USER.GENDER,
    veteranDateOfBirth: USER.BIRTH_DATE,
    veteranSocialSecurityNumber: USER.SSN_LAST_FOUR,
    homePhone: HOME_PHONE_FULL,
    mobilePhone: MOBILE_PHONE_FULL,
    email: USER.EMAIL,
    veteranAddress: {
      street: USER.MAILING_ADDRESS.ADDRESS_LINE1,
      city: USER.MAILING_ADDRESS.CITY,
      state: USER.MAILING_ADDRESS.STATE_CODE,
      country: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO3,
      postalCode: USER.MAILING_ADDRESS.ZIP_CODE,
      isMilitary: false,
    },
    toursOfDuty: [
      {
        serviceBranch: 'Space Force',
        dateRange: {
          from: '2021-01-01',
          to: '2023-01-01',
        },
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/applicant/information',
  },
};
module.exports = response;
