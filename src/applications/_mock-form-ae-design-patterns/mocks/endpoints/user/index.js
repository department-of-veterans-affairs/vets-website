const { cloneDeep, set } = require('lodash');
const { USER } = require('../../constants/user');

const loa3User = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'form-save-in-progress',
        'form-prefill',
        'form526',
        'evss-claims',
        'user-profile',
        'appeals-status',
        'id-card',
        'identity-proofed',
        'vet360',
        'lighthouse',
      ],
      account: {
        accountUuid: '7d9e2bfb-13ae-45c8-8764-ea3c87cd8af3',
      },
      profile: {
        email: 'vets.gov.user+75@gmail.com',
        firstName: USER.FIRST_NAME,
        middleName: USER.MIDDLE_INITIAL,
        lastName: USER.LAST_NAME,
        birthDate: USER.BIRTH_DATE,
        gender: USER.GENDER,
        zip: USER.MAILING_ADDRESS.ZIP_CODE,
        lastSignedIn: '2022-03-24T18:15:06.566Z',
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: 'idme',
          authBroker: 'sis',
          clientId: 'vaweb',
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        claims: {
          appeals: true,
          ch33BankAccounts: true,
          coe: true,
          communicationPreferences: true,
          connectedApps: true,
          medicalCopays: true,
          militaryHistory: true,
          paymentHistory: true,
          personalInformation: true,
          ratingInfo: true,
        },
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19560710',
        familyName: USER.LAST_NAME,
        gender: USER.GENDER,
        givenNames: [USER.FIRST_NAME, USER.MIDDLE_INITIAL],
        isCernerPatient: false,
        facilities: [
          {
            facilityId: '989',
            isCerner: false,
          },
          {
            facilityId: '987',
            isCerner: false,
          },
          {
            facilityId: '983',
            isCerner: false,
          },
        ],
        vaPatient: true,
        mhvAccountState: 'NONE',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
      inProgressForms: [],
      prefillsAvailable: [
        'FORM-MOCK-AE-DESIGN-PATTERNS',
        '21-686C',
        '40-10007',
        '0873',
        '22-1990',
        '22-1990N',
        '22-1990E',
        '22-1990EMEB',
        '22-1995',
        '22-5490',
        '22-5490E',
        '22-5495',
        '22-0993',
        '22-0994',
        'FEEDBACK-TOOL',
        '22-10203',
        '22-1990S',
        '22-1990EZ',
        '21-526EZ',
        '1010ez',
        '10-10EZR',
        '21P-530',
        '21P-527EZ',
        '686C-674',
        '20-0995',
        '20-0996',
        '10182',
        'MDOT',
        '5655',
        '28-8832',
        '28-1900',
        '26-1880',
        '26-4555',
      ],
      vet360ContactInformation: {
        email: {
          createdAt: '2018-04-20T17:24:13.000Z',
          emailAddress: USER.EMAIL,
          effectiveEndDate: null,
          effectiveStartDate: '2019-03-07T22:32:40.000Z',
          id: 20648,
          sourceDate: '2019-03-07T22:32:40.000Z',
          sourceSystemUser: null,
          transactionId: '44a0858b-3dd1-4de2-903d-38b147981a9c',
          updatedAt: '2019-03-08T05:09:58.000Z',
          vet360Id: '1273766',
        },
        residentialAddress: {
          addressLine1: USER.RESIDENTIAL_ADDRESS.ADDRESS_LINE1,
          addressLine2: USER.RESIDENTIAL_ADDRESS.ADDRESS_LINE2,
          addressLine3: USER.RESIDENTIAL_ADDRESS.ADDRESS_LINE3,
          addressPou: USER.RESIDENTIAL_ADDRESS.ADDRESS_POU,
          addressType: USER.RESIDENTIAL_ADDRESS.ADDRESS_TYPE,
          city: USER.RESIDENTIAL_ADDRESS.CITY,
          countryName: USER.RESIDENTIAL_ADDRESS.COUNTRY_NAME,
          countryCodeIso2: USER.RESIDENTIAL_ADDRESS.COUNTRY_CODE_ISO2,
          countryCodeIso3: USER.RESIDENTIAL_ADDRESS.COUNTRY_CODE_ISO3,
          countryCodeFips: null,
          countyCode: null,
          countyName: null,
          createdAt: '2022-03-21T21:26:35.000Z',
          effectiveEndDate: null,
          effectiveStartDate: '2022-03-23T19:11:51.000Z',
          geocodeDate: '2022-03-23T19:11:51.000Z',
          geocodePrecision: null,
          id: 312003,
          internationalPostalCode: null,
          latitude: 37.781,
          longitude: -122.4605,
          province: null,
          sourceDate: '2022-03-23T19:11:51.000Z',
          sourceSystemUser: null,
          stateCode: USER.RESIDENTIAL_ADDRESS.STATE_CODE,
          transactionId: 'c5adb989-3b87-47b6-afe3-dc18800cedc3',
          updatedAt: '2022-03-23T19:11:52.000Z',
          validationKey: null,
          vet360Id: '1273766',
          zipCode: USER.RESIDENTIAL_ADDRESS.ZIP_CODE,
          zipCodeSuffix: null,
          badAddress: null,
        },
        mailingAddress: {
          addressLine1: USER.MAILING_ADDRESS.ADDRESS_LINE1,
          addressLine2: USER.MAILING_ADDRESS.ADDRESS_LINE2,
          addressLine3: USER.MAILING_ADDRESS.ADDRESS_LINE3,
          addressPou: USER.MAILING_ADDRESS.ADDRESS_POU,
          addressType: USER.MAILING_ADDRESS.ADDRESS_TYPE,
          city: USER.MAILING_ADDRESS.CITY,
          countryName: USER.MAILING_ADDRESS.COUNTRY_NAME,
          countryCodeIso2: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO2,
          countryCodeIso3: USER.MAILING_ADDRESS.COUNTRY_CODE_ISO3,
          countryCodeFips: null,
          countyCode: null,
          countyName: null,
          createdAt: '2022-03-21T21:06:15.000Z',
          effectiveEndDate: null,
          effectiveStartDate: '2022-03-23T19:14:59.000Z',
          geocodeDate: '2022-03-23T19:15:00.000Z',
          geocodePrecision: null,
          id: 311999,
          internationalPostalCode: null,
          latitude: 45.2248,
          longitude: -121.3595,
          province: null,
          sourceDate: '2022-03-23T19:14:59.000Z',
          sourceSystemUser: null,
          stateCode: USER.MAILING_ADDRESS.STATE_CODE,
          transactionId: '3ea3ecf8-3ddf-46d9-8a4b-b5554385b3fb',
          updatedAt: '2022-03-23T19:15:01.000Z',
          validationKey: null,
          vet360Id: '1273766',
          zipCode: USER.MAILING_ADDRESS.ZIP_CODE,
          zipCodeSuffix: null,
          badAddress: null,
        },
        mobilePhone: {
          areaCode: USER.MOBILE_PHONE.AREA_CODE,
          countryCode: '1',
          createdAt: '2022-01-12T16:22:03.000Z',
          extension: null,
          effectiveEndDate: null,
          effectiveStartDate: '2022-02-17T20:15:44.000Z',
          id: 269804,
          isInternational: false,
          isTextable: null,
          isTextPermitted: null,
          isTty: null,
          isVoicemailable: null,
          phoneNumber: USER.MOBILE_PHONE.PHONE_NUMBER,
          phoneType: USER.MOBILE_PHONE.PHONE_TYPE,
          sourceDate: '2022-02-17T20:15:44.000Z',
          sourceSystemUser: null,
          transactionId: 'fdb13953-f670-4bd3-a3bb-8881eb9165dd',
          updatedAt: '2022-02-17T20:15:45.000Z',
          vet360Id: '1273766',
        },
        homePhone: {
          areaCode: USER.HOME_PHONE.AREA_CODE,
          countryCode: '1',
          createdAt: '2018-04-20T17:22:56.000Z',
          extension: null,
          effectiveEndDate: null,
          effectiveStartDate: '2022-03-11T16:31:55.000Z',
          id: 2272982,
          isInternational: false,
          isTextable: null,
          isTextPermitted: null,
          isTty: null,
          isVoicemailable: null,
          phoneNumber: USER.HOME_PHONE.PHONE_NUMBER,
          phoneType: USER.HOME_PHONE.PHONE_TYPE,
          sourceDate: '2022-03-11T16:31:55.000Z',
          sourceSystemUser: null,
          transactionId: '2814cdf6-7f2c-431b-95f3-d37f3837215d',
          updatedAt: '2022-03-11T16:31:56.000Z',
          vet360Id: '1273766',
        },
        workPhone: null,
        temporaryPhone: null,
        faxNumber: null,
        textPermission: null,
      },
      session: {
        ssoe: true,
        transactionid: 'YEI6t8W3ANsvCT04oB+iXh/UP03PXSFg3Y36L2QaxLE=',
      },
    },
  },
  meta: {
    errors: null,
  },
};

const loa3UserWithUpdatedHomePhone = set(
  cloneDeep(loa3User),
  'data.attributes.vet360ContactInformation.homePhone.phoneNumber',
  '8985555',
);

const loa3UserWithUpdatedHomePhoneTimeStamp = set(
  cloneDeep(loa3UserWithUpdatedHomePhone),
  'data.attributes.vet360ContactInformation.homePhone.updatedAt',
  '2023-03-11T16:31:56.000Z',
);

const loa3UserWithUpdatedMailingAddress = set(
  set(
    cloneDeep(loa3User),
    'data.attributes.vet360ContactInformation.mailingAddress.addressLine1',
    '345 Mailing Address St.',
  ),
  'data.attributes.vet360ContactInformation.mailingAddress.updatedAt',
  new Date().toISOString(),
);

const loa3UserWithNoEmail = set(
  cloneDeep(loa3User),
  'data.attributes.vet360ContactInformation.email',
  {},
);

const loa3UserWithNoContactInfo = set(
  cloneDeep(loa3User),
  'data.attributes.vet360ContactInformation',
  {
    email: {
      ...loa3User.data.attributes.vet360ContactInformation.email,
      emailAddress: '',
    },
    homePhone: {
      ...loa3User.data.attributes.vet360ContactInformation.homePhone,
      phoneNumber: '',
      areaCode: '',
      countryCode: '',
      phoneType: '',
    },
    mobilePhone: {
      ...loa3User.data.attributes.vet360ContactInformation.mobilePhone,
      phoneNumber: '',
      areaCode: '',
      countryCode: '',
      phoneType: '',
    },
    mailingAddress: {
      ...loa3User.data.attributes.vet360ContactInformation.mailingAddress,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      stateCode: '',
      zipCode: '',
      countryCodeIso2: '',
      countryCodeIso3: '',
      countryCodeFips: '',
      countyCode: '',
      countyName: '',
      createdAt: '',
      effectiveEndDate: '',
      effectiveStartDate: '',
      geocodeDate: '',
      geocodePrecision: '',
      id: '',
      internationalPostalCode: '',
      latitude: '',
      longitude: '',
    },
  },
);

module.exports = {
  loa3User,
  loa3UserWithUpdatedHomePhoneTimeStamp,
  loa3UserWithUpdatedMailingAddress,
  loa3UserWithNoEmail,
  loa3UserWithNoContactInfo,
};
