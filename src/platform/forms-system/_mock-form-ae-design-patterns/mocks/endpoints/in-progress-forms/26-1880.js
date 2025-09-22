const { USER, FULL_NAME } = require('../../constants/user');

const response = {
  formData: {
    fullName: FULL_NAME,
    dateOfBirth: USER.BIRTH_DATE,
    applicantAddress: {
      street: USER.MAILING_ADDRESS.ADDRESS_LINE1,
      city: USER.MAILING_ADDRESS.CITY,
      state: USER.MAILING_ADDRESS.STATE_CODE,
      country: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO3,
      postalCode: USER.MAILING_ADDRESS.ZIP_CODE,
    },
    contactPhone: `${USER.HOME_PHONE.AREA_CODE}${USER.HOME_PHONE.PHONE_NUMBER}`,
    contactEmail: USER.EMAIL,
    periodsOfService: [
      {
        serviceBranch: 'Air Force',
        dateRange: {
          from: '2001-03-21',
          to: '2014-07-21',
        },
      },
      {
        serviceBranch: 'Marine Corps',
        dateRange: {
          from: '2015-06-27',
          to: '2018-07-11',
        },
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/applicant-information',
  },
};

module.exports = response;
