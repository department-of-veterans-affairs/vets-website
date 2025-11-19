const { USER, FULL_NAME, HOME_PHONE_FULL } = require('../../constants/user');

const prefill = {
  formData: {
    fullName: FULL_NAME,
    dateOfBirth: USER.BIRTH_DATE,
    veteranId: {
      ssn: USER.SSN,
      vaFileNumber: USER.VA_FILE_NUMBER,
    },
    homePhone: HOME_PHONE_FULL,
    emailAddress: USER.EMAIL,
    address: {
      street: USER.MAILING_ADDRESS.ADDRESS_LINE1,
      street2: USER.MAILING_ADDRESS.ADDRESS_LINE2,
      street3: USER.MAILING_ADDRESS.ADDRESS_LINE3,
      city: USER.MAILING_ADDRESS.CITY,
      state: USER.MAILING_ADDRESS.STATE_CODE,
      postalCode: USER.MAILING_ADDRESS.ZIP_CODE,
      country: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO3,
    },
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
};

// contains prefill with additional data like employers and treatment records
const prefillMaximal = {
  formData: {
    fullName: FULL_NAME,
    dateOfBirth: USER.BIRTH_DATE,
    veteranId: {
      ssn: USER.SSN,
      vaFileNumber: USER.VA_FILE_NUMBER,
    },
    homePhone: HOME_PHONE_FULL,
    emailAddress: USER.EMAIL,
    address: {
      street: USER.MAILING_ADDRESS.ADDRESS_LINE1,
      street2: USER.MAILING_ADDRESS.ADDRESS_LINE2,
      street3: USER.MAILING_ADDRESS.ADDRESS_LINE3,
      city: USER.MAILING_ADDRESS.CITY,
      state: USER.MAILING_ADDRESS.STATE_CODE,
      postalCode: USER.MAILING_ADDRESS.ZIP_CODE,
      country: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO3,
    },
    relationshipToVeteran: {
      relationshipToVeteran: 'other',
      otherRelationshipToVeteran: 'second removed cousin',
    },
    'view:hasEmployers': true,
    employers: [
      {
        employerName: 'ABC Corporation',
        employerAddress: {
          street: '123 Business Ave',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
        },
        employerDates: {
          from: '2020-01-15',
          to: '2023-05-30',
        },
      },
    ],
    treatmentRecords: [
      {
        name: 'City Medical Center',
        address: {
          street: '456 Hospital Rd',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'USA',
        },
        treatmentDates: {
          from: '2022-03-10',
          to: '2022-03-15',
        },
        conditionsTreated: 'Knee injury rehabilitation',
      },
      {
        name: 'Veterans Hospital',
        address: {
          street: '789 VA Blvd',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'USA',
        },
        treatmentDates: {
          from: '2023-01-05',
          to: '2023-01-20',
        },
        conditionsTreated: 'Post-traumatic stress counseling',
      },
    ],
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
};

module.exports = {
  prefill,
  prefillMaximal,
};
