import { rest } from 'msw';
import mockDisabilityCompensation from '@@profile/mocks/endpoints/disability-compensations';
import environment from '~/platform/utilities/environment';

import mockDD4CNPSuccess from './tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4EDUSuccess from './tests/fixtures/dd4edu/dd4edu-enrolled.json';
import mockMHVHasAccepted from './tests/fixtures/mhv-has-accepted.json';
import mockFullNameSuccess from './tests/fixtures/full-name-success.json';
import mockPersonalInfoSuccess from './tests/fixtures/personal-information-success.json';
import mockServiceHistorySuccess from './tests/fixtures/service-history-success.json';

import mock401 from './tests/fixtures/401.json';
import mock500 from './tests/fixtures/500.json';

const errorResponseHandler500 = (req, res, ctx) => {
  return res(ctx.status(500), ctx.json(mock500));
};

const errorResponseHandler401 = (req, res, ctx) => {
  return res(ctx.status(401), ctx.json(mock401));
};

// The transactionId of a resolved/failed transaction must match the
// transactionId of the pending transaction or the status of the transaction
// will never update.
const transactionId = '61ffa9bd-3290-4e4b-9480-d93fd6236dcf';

export const newPaymentAccount = {
  accountType: 'Savings',
  financialInstitutionName: 'COMERICA BANK',
  accountNumber: '*****6789',
  financialInstitutionRoutingNumber: '*****4321',
};

const prefix = environment.API_URL;

export const updateDD4CNPSuccess = [
  rest.put(
    `${prefix}/v0/profile/direct_deposits/disability_compensations`,
    (req, res, ctx) => {
      return res(ctx.json(mockDisabilityCompensation.updates.success));
    },
  ),
];

export const updateDD4CNPFailure = [
  rest.put(
    `${prefix}/v0/profile/direct_deposits/disability_compensations`,
    (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json(mockDisabilityCompensation.updates.errors.generic),
      );
    },
  ),
];

// Response when successfully creating a transaction request. This body mentions
// `email` in a couple of places but for testing purposes I'm reusing this body
// for _all_ transaction creation requests.
const createTransactionRequestSuccessBody = {
  id: '',
  type: 'async_transaction_va_profile_email_transactions',
  attributes: {
    transactionId,
    transactionStatus: 'RECEIVED',
    type: 'AsyncTransaction::VAProfile::EmailTransaction',
    metadata: [],
  },
};

// Error object when transaction fails to be created. This mentions `email` in a
// couple of places but for testing purposes I'm reusing this body for _all_
// transaction creation requests.
const createTransactionRequestFailedError = {
  code: 'VET360_EMAIL206',
  detail: 'Confirmation Date can not be greater than sourceDate',
  status: '400',
  title: 'Confirmation Date can not be greater than sourceDate',
};

export const validateAddressFailure = [
  rest.post(`${prefix}/v0/profile/address_validation`, errorResponseHandler500),
];

// Response when transaction fails to be created.
export const createTransactionFailure = [
  rest.post(`${prefix}/v0/profile/*`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        // response pulled from vets-api config/locales/exceptions.en.yml
        errors: [createTransactionRequestFailedError],
      }),
    );
  }),
  rest.put(`${prefix}/v0/profile/*`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        // response pulled from vets-api config/locales/exceptions.en.yml
        errors: [createTransactionRequestFailedError],
      }),
    );
  }),
  rest.delete(`${prefix}/v0/profile/*`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        // response pulled from vets-api config/locales/exceptions.en.yml
        errors: [createTransactionRequestFailedError],
      }),
    );
  }),
];

// When a transaction has not resolved or failed. This mentions `email` in a
// couple of places but for testing purposes I'm reusing this body for _all_
// transaction.
export const transactionPending = [
  rest.get(`${prefix}/v0/profile/status/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '',
          type: 'async_transaction_va_profile_email_transactions',
          attributes: {
            transactionId,
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::VAProfile::EmailTransaction',
            metadata: [],
          },
        },
      }),
    );
  }),
];

// When the transaction fails to resolve. This mentions `email` and `address`
// but for testing purposes I'm reusing body for _all_ transactions since the
// metadata does not matter for the cases we are testing.
export const transactionFailed = [
  rest.get(`${prefix}/v0/profile/status/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '',
          type: 'async_transaction_va_profile_email_transactions',
          attributes: {
            transactionId,
            transactionStatus: 'COMPLETED_FAILURE',
            type: 'AsyncTransaction::VAProfile::EmailTransaction',
            // this metadata is from a failed address update, _not_ a failed
            // email address update, but the metadata does not matter in the
            // case of a failed email address update
            metadata: [
              {
                code: 'ADDR312',
                key: 'addressBio.failAddressOverrideCriteria',
                retryable: null,
                severity: 'ERROR',
                text:
                  'The address override criteria has not been met, please attempt validation again',
              },
            ],
          },
        },
      }),
    );
  }),
];

// When the transaction resolves. This mentions `email` but for testing purposes
// I'm reusing this for _all_ transactions since the metadata does not matter
// for the cases we are testing.
export const transactionSucceeded = [
  rest.get(`${prefix}/v0/profile/status/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: 173917,
          type: 'async_transaction_va_profile_email_transactions',
          attributes: {
            transactionId,
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::EmailTransaction',
            metadata: [],
          },
        },
      }),
    );
  }),
];

// Sets up the responses needed to mock a successful email update. In particular
// it mocks the `GET user/` response so that the updated email address matches
// the email address that was entered in the Edit Email Address view.
export const editEmailAddressSuccess = () => {
  // store the email address that's passed in via the POST or PUT call so we can
  // return it with the GET user/ response
  let newEmailAddress;
  return [
    rest.post(`${prefix}/v0/profile/email_addresses`, (req, res, ctx) => {
      newEmailAddress = req.body.emailAddress;
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    rest.put(`${prefix}/v0/profile/email_addresses`, (req, res, ctx) => {
      newEmailAddress = req.body.emailAddress;
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: '',
            type: 'users_scaffolds',
            attributes: {
              services: ['user-profile', 'vet360'],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
              },
              veteranStatus: {
                status: 'OK',
                isVeteran: true,
                servedInMilitary: true,
              },

              vet360ContactInformation: {
                email: {
                  createdAt: '2020-07-28T14:57:54.000Z',
                  emailAddress: newEmailAddress,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-28T14:57:53.000Z',
                  id: 114818,
                  sourceDate: '2020-07-28T14:57:53.000Z',
                  sourceSystemUser: null,
                  transactionId,
                  updatedAt: '2020-07-28T14:57:54.000Z',
                  vet360Id: '1273780',
                },
                mailingAddress: {
                  addressLine1: '8210 Doby Ln',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  addressType: 'DOMESTIC',
                  city: 'Pasadena',
                  countryName: 'United States',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  countryCodeFips: null,
                  countyCode: '24003',
                  countyName: 'Anne Arundel County',
                  createdAt: '2020-05-30T03:57:20.000Z',
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:31:00.000Z',
                  id: 173917,
                  internationalPostalCode: null,
                  province: null,
                  sourceDate: '2020-07-25T00:31:00.000Z',
                  sourceSystemUser: null,
                  stateCode: 'MD',
                  transactionId: '2ad2aef3-101a-4bc9-b7dc-2e7ce772c215',
                  updatedAt: '2020-07-25T00:31:02.000Z',
                  validationKey: null,
                  vet360Id: '1273780',
                  zipCode: '21122',
                  zipCodeSuffix: '6706',
                },
              },
            },
          },
          meta: { errors: null },
        }),
      );
    }),
  ];
};

// Sets up the responses needed to mock a successful email deletion. In
// particular it mocks the `GET user/` response so that the email address no
// longer exists
export const deleteEmailAddressSuccess = [
  rest.delete(`${prefix}/v0/profile/email_addresses`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: createTransactionRequestSuccessBody,
      }),
    );
  }),
  rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            services: ['user-profile', 'vet360'],
            account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
            profile: {
              loa: { current: 3, highest: 3 },
              multifactor: true,
              verified: true,
              authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
            },
            vaProfile: {
              status: 'OK',
            },
            veteranStatus: {
              status: 'OK',
              isVeteran: true,
              servedInMilitary: true,
            },
            vet360ContactInformation: {
              email: null,
            },
          },
        },
        meta: { errors: null },
      }),
    );
  }),
];

// Sets up the responses needed to mock a successful phone number update. In
// particular it mocks the `GET user/` response so that _all_ of the phone
// numbers match the phone number that was entered in the Edit Phone view.
export const editPhoneNumberSuccess = () => {
  // store the phone number that's passed in via the POST or PUT call so we can
  // return it with the GET user/ response
  let newAreaCode;
  let newPhoneNumber;
  return [
    rest.post(`${prefix}/v0/profile/telephones`, (req, res, ctx) => {
      newAreaCode = req.body.areaCode;
      newPhoneNumber = req.body.phoneNumber;
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    rest.put(`${prefix}/v0/profile/telephones`, (req, res, ctx) => {
      newAreaCode = req.body.areaCode;
      newPhoneNumber = req.body.phoneNumber;
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    // for testing purposes, after saving a phone number, return a user object
    // where that phone number is saved for _all_ numbers: home, work, mobile
    // and fax
    rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: '',
            type: 'users_scaffolds',
            attributes: {
              services: ['user-profile', 'vet360'],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
              },
              veteranStatus: {
                status: 'OK',
                isVeteran: true,
                servedInMilitary: true,
              },
              vet360ContactInformation: {
                mobilePhone: {
                  areaCode: newAreaCode,
                  countryCode: '1',
                  createdAt: '2020-07-25T00:34:24.000Z',
                  extension: null,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:34:24.000Z',
                  id: 155102,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: null,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: newPhoneNumber,
                  phoneType: 'MOBILE',
                  sourceDate: '2020-07-25T00:34:24.000Z',
                  sourceSystemUser: null,
                  transactionId: '77ad4f31-2d1a-4aaa-a259-7f0cc8fb0357',
                  updatedAt: '2020-07-25T00:34:24.000Z',
                  vet360Id: '1273780',
                },
                homePhone: {
                  areaCode: newAreaCode,
                  countryCode: '1',
                  createdAt: '2020-07-25T00:33:15.000Z',
                  extension: null,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:33:14.000Z',
                  id: 155101,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: null,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: newPhoneNumber,
                  phoneType: 'HOME',
                  sourceDate: '2020-07-25T00:33:14.000Z',
                  sourceSystemUser: null,
                  transactionId: 'a7299f8e-1646-40f5-988d-61d0480c01dc',
                  updatedAt: '2020-07-25T00:33:15.000Z',
                  vet360Id: '1273780',
                },
                workPhone: {
                  areaCode: newAreaCode,
                  countryCode: '1',
                  createdAt: '2020-07-25T00:33:51.000Z',
                  extension: null,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:33:51.000Z',
                  id: 155103,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: null,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: newPhoneNumber,
                  phoneType: 'WORK',
                  sourceDate: '2020-07-25T00:33:51.000Z',
                  sourceSystemUser: null,
                  transactionId: 'b98371ec-bfd5-4724-89ee-3ea3c48dac81',
                  updatedAt: '2020-07-25T00:33:51.000Z',
                  vet360Id: '1273780',
                },
                temporaryPhone: null,
                faxNumber: {
                  areaCode: newAreaCode,
                  countryCode: '1',
                  createdAt: '2020-07-31T20:54:34.000Z',
                  extension: null,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-31T20:54:33.000Z',
                  id: 156326,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: null,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: newPhoneNumber,
                  phoneType: 'FAX',
                  sourceDate: '2020-07-31T20:54:33.000Z',
                  sourceSystemUser: null,
                  transactionId: '96a806c2-0af8-4e5a-b8b2-30c44f3a4759',
                  updatedAt: '2020-07-31T20:54:34.000Z',
                  vet360Id: '1273780',
                },
                textPermission: null,
              },
            },
          },
          meta: { errors: null },
        }),
      );
    }),
  ];
};

// Sets up the responses needed to mock a successful phone number deletion. Note
// that, to make our lives easier, it mocks the `GET user/` response so that
// _all_ phone numbers are deleted.
export const deletePhoneNumberSuccess = () => {
  return [
    rest.delete(`${prefix}/v0/profile/telephones`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: '',
            type: 'users_scaffolds',
            attributes: {
              services: ['user-profile', 'vet360'],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
              },
              veteranStatus: {
                status: 'OK',
                isVeteran: true,
                servedInMilitary: true,
              },
              vet360ContactInformation: {
                mobilePhone: null,
                homePhone: null,
                workPhone: null,
                temporaryPhone: null,
                faxNumber: null,
                textPermission: null,
              },
            },
          },
          meta: { errors: null },
        }),
      );
    }),
  ];
};

// Sets up the responses needed to mock a successful address update. In
// particular it mocks the `GET user/` response so that both mailing and
// residential addresses are updated to make testing a little bit easier
export const editAddressSuccess = [
  rest.post(`${prefix}/v0/profile/address_validation`, (req, res, ctx) => {
    return res(
      ctx.json({
        addresses: [
          {
            address: {
              addressLine1: '123 Main St',
              addressType: 'DOMESTIC',
              city: 'San Francisco',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              countyCode: '06075',
              countyName: 'San Francisco',
              stateCode: 'CA',
              zipCode: '94105',
              zipCodeSuffix: '1804',
            },
            addressMetaData: {
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'RESIDENTIAL',
            },
          },
        ],
        validationKey: 1438191680,
      }),
    );
  }),
  rest.post(`${prefix}/v0/profile/addresses`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: createTransactionRequestSuccessBody,
      }),
    );
  }),
  rest.put(`${prefix}/v0/profile/addresses`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: createTransactionRequestSuccessBody,
      }),
    );
  }),
  // for testing purposes, after saving an address, return a user object
  // where both the mailing and residential addresses are updated.
  rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            services: ['user-profile', 'vet360'],
            account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
            profile: {
              loa: { current: 3, highest: 3 },
              multifactor: true,
              verified: true,
              authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
            },
            vaProfile: {
              status: 'OK',
            },
            veteranStatus: {
              status: 'OK',
              isVeteran: true,
              servedInMilitary: true,
            },
            vet360ContactInformation: {
              email: null,
              residentialAddress: {
                addressLine1: '123 Main St',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'RESIDENCE/CHOICE',
                addressType: 'DOMESTIC',
                city: 'San Francisco',
                countryName: 'United States',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryCodeFips: null,
                countyCode: '06075',
                countyName: 'San Francisco',
                createdAt: '2020-07-25T00:32:10.000Z',
                effectiveEndDate: null,
                effectiveStartDate: '2020-07-25T00:32:09.000Z',
                id: 185731,
                internationalPostalCode: null,
                province: null,
                sourceDate: '2020-07-25T00:32:09.000Z',
                sourceSystemUser: null,
                stateCode: 'CA',
                transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
                updatedAt: '2020-07-25T00:32:10.000Z',
                validationKey: null,
                vet360Id: '1273780',
                zipCode: '94105',
                zipCodeSuffix: '1804',
              },
              mailingAddress: {
                addressLine1: '123 Main St',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'CORRESPONDENCE',
                addressType: 'DOMESTIC',
                city: 'San Francisco',
                countryName: 'United States',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryCodeFips: null,
                countyCode: '06075',
                countyName: 'San Francisco',
                createdAt: '2020-07-25T00:32:10.000Z',
                effectiveEndDate: null,
                effectiveStartDate: '2020-07-25T00:32:09.000Z',
                id: 185731,
                internationalPostalCode: null,
                province: null,
                sourceDate: '2020-07-25T00:32:09.000Z',
                sourceSystemUser: null,
                stateCode: 'CA',
                transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
                updatedAt: '2020-07-25T00:32:10.000Z',
                validationKey: null,
                vet360Id: '1273780',
                zipCode: '94105',
                zipCodeSuffix: '1804',
              },
            },
          },
        },
        meta: { errors: null },
      }),
    );
  }),
];

// Sets up the responses needed to mock a successful home address deletion. In
// particular it mocks the `GET user/` response so that the residential address
// is deleted.
export const deleteResidentialAddressSuccess = [
  rest.delete(`${prefix}/v0/profile/addresses`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: createTransactionRequestSuccessBody,
      }),
    );
  }),
  rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            services: ['user-profile', 'vet360'],
            account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
            profile: {
              loa: { current: 3, highest: 3 },
              multifactor: true,
              verified: true,
              authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
            },
            vaProfile: {
              status: 'OK',
            },
            veteranStatus: {
              status: 'OK',
              isVeteran: true,
              servedInMilitary: true,
            },
            vet360ContactInformation: {
              email: null,
              residentialAddress: null,
            },
          },
        },
        meta: { errors: null },
      }),
    );
  }),
];

export const toggleSMSNotificationsSuccess = (enrolled = true) => {
  return [
    rest.put(`${prefix}/v0/profile/telephones`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: createTransactionRequestSuccessBody,
        }),
      );
    }),
    rest.get(`${prefix}/v0/user`, (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            id: '',
            type: 'users_scaffolds',
            attributes: {
              services: ['user-profile', 'vet360'],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                veteranStatus: {
                  status: 'OK',
                  isVeteran: true,
                  servedInMilitary: true,
                },
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
                vaPatient: true,
              },

              vet360ContactInformation: {
                email: null,
                residentialAddress: null,
                mailingAddress: null,
                mobilePhone: {
                  areaCode: '555',
                  countryCode: '1',
                  createdAt: '2020-07-25T00:34:24.000Z',
                  extension: null,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:34:24.000Z',
                  id: 155102,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: enrolled,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: '5555559',
                  phoneType: 'MOBILE',
                  sourceDate: '2020-07-25T00:34:24.000Z',
                  sourceSystemUser: null,
                  transactionId: '77ad4f31-2d1a-4aaa-a259-7f0cc8fb0357',
                  updatedAt: '2020-07-25T00:34:24.000Z',
                  vet360Id: '1273780',
                },
              },
            },
          },
          meta: { errors: null },
        }),
      );
    }),
  ];
};

export const allProfileEndpointsLoaded = [
  rest.get(`${prefix}/v0/mhv_account`, (req, res, ctx) => {
    return res(ctx.json(mockMHVHasAccepted));
  }),
  rest.get(`${prefix}/v0/profile/full_name`, (req, res, ctx) => {
    return res(ctx.json(mockFullNameSuccess));
  }),
  rest.get(`${prefix}/v0/profile/personal_information`, (req, res, ctx) => {
    return res(ctx.json(mockPersonalInfoSuccess));
  }),
  rest.get(`${prefix}/v0/profile/service_history`, (req, res, ctx) => {
    return res(ctx.json(mockServiceHistorySuccess));
  }),
  rest.get(`${prefix}/v0/ppiu/payment_information`, (req, res, ctx) => {
    return res(ctx.json(mockDD4CNPSuccess));
  }),
  rest.get(`${prefix}/v0/profile/ch33_bank_accounts`, (req, res, ctx) => {
    return res(ctx.json(mockDD4EDUSuccess));
  }),
  rest.get(
    `${prefix}/v0/disability_compensation_form/rating_info`,
    errorResponseHandler500,
  ),
  rest.get(
    `${prefix}/v0/profile/connected_applications`,
    errorResponseHandler500,
  ),
];

export const getFullNameFailure = [
  rest.get(`${prefix}/v0/profile/full_name`, errorResponseHandler401),
];

export const getPersonalInformationFailure = [
  rest.get(
    `${prefix}/v0/profile/personal_information`,
    errorResponseHandler500,
  ),
];

export const getServiceHistory500 = [
  rest.get(`${prefix}/v0/profile/service_history`, errorResponseHandler500),
];

export const getServiceHistory401 = [
  rest.get(`${prefix}/v0/profile/service_history`, errorResponseHandler401),
];

export const getDD4EDUFailure = [
  rest.get(`${prefix}/v0/profile/ch33_bank_accounts`, errorResponseHandler401),
];
