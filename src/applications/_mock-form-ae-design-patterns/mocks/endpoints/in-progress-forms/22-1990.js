const { USER } = require('../../constants/user');

const responses = {
  FORM_22_1990: {
    minimal: {
      formData: {
        veteranFullName: {
          first: USER.FIRST_NAME,
          middle: USER.MIDDLE_NAME,
          last: USER.LAST_NAME,
        },
        gender: USER.GENDER,
        veteranDateOfBirth: USER.BIRTH_DATE,
        veteranSocialSecurityNumber: USER.SSN_LAST_FOUR,
        homePhone: `${USER.HOME_PHONE.AREA_CODE}${
          USER.HOME_PHONE.PHONE_NUMBER
        }`,
        mobilePhone: `${USER.MOBILE_PHONE.AREA_CODE}${
          USER.MOBILE_PHONE.PHONE_NUMBER
        }`,
        email: USER.EMAIL,
        veteranAddress: {
          street: USER.MAILING_ADDRESS.ADDRESS_LINE1,
          city: USER.MAILING_ADDRESS.CITY,
          state: USER.MAILING_ADDRESS.STATE_CODE,
          country: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO2,
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
    },
  },
};
module.exports = responses;
