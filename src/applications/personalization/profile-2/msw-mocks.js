import { rest } from 'msw';
import environment from 'platform/utilities/environment';

export const newPaymentAccount = {
  accountType: 'Savings',
  financialInstitutionName: 'COMERICA BANK',
  accountNumber: '*****6789',
  financialInstitutionRoutingNumber: '*****4321',
};

const prefix = environment.API_URL;

export const updateDirectDepositSuccess = [
  rest.put(
    // I'd prefer to just set the route as `ppiu/payment_information` or at least `v0/ppiu/payment_information`
    `${prefix}/v0/ppiu/payment_information`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: {
            attributes: {
              responses: [
                {
                  paymentAccount: newPaymentAccount,
                },
              ],
            },
          },
        }),
      );
    },
  ),
];

export const updateDirectDepositFailure = [
  rest.put(`${prefix}/v0/ppiu/payment_information`, (req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
                },
              ],
            },
          },
        ],
      }),
    );
  }),
];

// Response when successfully creating a transaction request. This body mentions
// `email` in a couple of places but for testing purposes I'm reusing this body
// for _all_ transaction creation requests.
const createTransactionRequestSuccessBody = {
  id: '',
  type: 'async_transaction_vet360_email_transactions',
  attributes: {
    transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
    transactionStatus: 'RECEIVED',
    type: 'AsyncTransaction::Vet360::EmailTransaction',
    metadata: [],
  },
};

// Error object when transaction fails to be created. This mentions `email` in a
// couple of places but for testing purposes I'm reusing this body for _all_
// transaction creation requests.
const createTransactionRequestFailedError = {
  title: 'Check Email Domain',
  code: 'VET360_EMAIL304',
  detail: 'AlphaNumeric ToplevelDomainName must be <= 63 Characters.',
  status: '400',
};

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
          type: 'async_transaction_vet360_email_transactions',
          attributes: {
            transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
            transactionStatus: 'RECEIVED',
            type: 'AsyncTransaction::Vet360::EmailTransaction',
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
          type: 'async_transaction_vet360_email_transactions',
          attributes: {
            transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
            transactionStatus: 'COMPLETED_FAILURE',
            type: 'AsyncTransaction::Vet360::EmailTransaction',
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
          id: '',
          type: 'async_transaction_vet360_email_transactions',
          attributes: {
            transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::Vet360::EmailTransaction',
            metadata: [],
          },
        },
      }),
    );
  }),
];

// Sets up the responses needed to mack a successful email update. In particular
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
              services: [
                'facilities',
                'hca',
                'edu-benefits',
                'form-save-in-progress',
                'form-prefill',
                'mhv-accounts',
                'evss-claims',
                'form526',
                'user-profile',
                'appeals-status',
                'id-card',
                'identity-proofed',
                'vet360',
                'evss_common_client',
                'claim_increase',
              ],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                email: 'vets.gov.user+36@gmail.com',
                firstName: 'WESLEY',
                middleName: 'WATSON',
                lastName: 'FORD',
                birthDate: '1986-05-06',
                gender: 'M',
                zip: '21122-6706',
                lastSignedIn: '2020-07-28T14:57:28.196Z',
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                signIn: {
                  serviceName: 'idme',
                  accountType: 'N/A',
                  ssoe: true,
                  transactionid: '/lob0lmUWabZaaWqJ+ydOKkCYvu55jG3IxIJI4qzGic=',
                },
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
                birthDate: '19860506',
                familyName: 'Ford',
                gender: 'M',
                givenNames: ['Wesley', 'Watson'],
                isCernerPatient: false,
                facilities: [{ facilityId: '983', isCerner: false }],
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
                '21-686C',
                '40-10007',
                '22-1990',
                '22-1990N',
                '22-1990E',
                '22-1995',
                '22-1995S',
                '22-5490',
                '22-5495',
                '22-0993',
                '22-0994',
                'FEEDBACK-TOOL',
                '22-10203',
                '21-526EZ',
                '21-526EZ-BDD',
                '1010ez',
                '21P-530',
                '21P-527EZ',
                '686C-674',
                '20-0996',
                'MDOT',
              ],
              vet360ContactInformation: {
                email: {
                  createdAt: '2020-07-28T14:57:54.000Z',
                  emailAddress: newEmailAddress,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-28T14:57:53.000Z',
                  id: 114818,
                  sourceDate: '2020-07-28T14:57:53.000Z',
                  sourceSystemUser: null,
                  transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
                  updatedAt: '2020-07-28T14:57:54.000Z',
                  vet360Id: '1273780',
                },
                residentialAddress: {
                  addressLine1: '34 Blanchard Rd',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'RESIDENCE/CHOICE',
                  addressType: 'DOMESTIC',
                  city: 'Shirley Mills',
                  countryName: 'United States',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  countryCodeFips: null,
                  countyCode: '23021',
                  countyName: 'Piscataquis County',
                  createdAt: '2020-07-25T00:32:10.000Z',
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:32:09.000Z',
                  id: 185731,
                  internationalPostalCode: null,
                  province: null,
                  sourceDate: '2020-07-25T00:32:09.000Z',
                  sourceSystemUser: null,
                  stateCode: 'ME',
                  transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
                  updatedAt: '2020-07-25T00:32:10.000Z',
                  validationKey: null,
                  vet360Id: '1273780',
                  zipCode: '04485',
                  zipCodeSuffix: '4413',
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
                  isTextPermitted: null,
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
                homePhone: {
                  areaCode: '804',
                  countryCode: '1',
                  createdAt: '2020-07-25T00:33:15.000Z',
                  extension: '17747',
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:33:14.000Z',
                  id: 155101,
                  isInternational: false,
                  isTextable: null,
                  isTextPermitted: null,
                  isTty: null,
                  isVoicemailable: null,
                  phoneNumber: '2055544',
                  phoneType: 'HOME',
                  sourceDate: '2020-07-25T00:33:14.000Z',
                  sourceSystemUser: null,
                  transactionId: 'a7299f8e-1646-40f5-988d-61d0480c01dc',
                  updatedAt: '2020-07-25T00:33:15.000Z',
                  vet360Id: '1273780',
                },
                workPhone: {
                  areaCode: '214',
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
                  phoneNumber: '7182112',
                  phoneType: 'WORK',
                  sourceDate: '2020-07-25T00:33:51.000Z',
                  sourceSystemUser: null,
                  transactionId: 'b98371ec-bfd5-4724-89ee-3ea3c48dac81',
                  updatedAt: '2020-07-25T00:33:51.000Z',
                  vet360Id: '1273780',
                },
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

// Sets up the responses needed to mack a successful email deletion. In
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
            services: [
              'facilities',
              'hca',
              'edu-benefits',
              'form-save-in-progress',
              'form-prefill',
              'mhv-accounts',
              'evss-claims',
              'form526',
              'user-profile',
              'appeals-status',
              'id-card',
              'identity-proofed',
              'vet360',
              'evss_common_client',
              'claim_increase',
            ],
            account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
            profile: {
              email: 'vets.gov.user+36@gmail.com',
              firstName: 'WESLEY',
              middleName: 'WATSON',
              lastName: 'FORD',
              birthDate: '1986-05-06',
              gender: 'M',
              zip: '21122-6706',
              lastSignedIn: '2020-07-28T14:57:28.196Z',
              loa: { current: 3, highest: 3 },
              multifactor: true,
              verified: true,
              signIn: {
                serviceName: 'idme',
                accountType: 'N/A',
                ssoe: true,
                transactionid: '/lob0lmUWabZaaWqJ+ydOKkCYvu55jG3IxIJI4qzGic=',
              },
              authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
            },
            vaProfile: {
              status: 'OK',
              birthDate: '19860506',
              familyName: 'Ford',
              gender: 'M',
              givenNames: ['Wesley', 'Watson'],
              isCernerPatient: false,
              facilities: [{ facilityId: '983', isCerner: false }],
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
              '21-686C',
              '40-10007',
              '22-1990',
              '22-1990N',
              '22-1990E',
              '22-1995',
              '22-1995S',
              '22-5490',
              '22-5495',
              '22-0993',
              '22-0994',
              'FEEDBACK-TOOL',
              '22-10203',
              '21-526EZ',
              '21-526EZ-BDD',
              '1010ez',
              '21P-530',
              '21P-527EZ',
              '686C-674',
              '20-0996',
              'MDOT',
            ],
            vet360ContactInformation: {
              email: null,
              residentialAddress: {
                addressLine1: '34 Blanchard Rd',
                addressLine2: null,
                addressLine3: null,
                addressPou: 'RESIDENCE/CHOICE',
                addressType: 'DOMESTIC',
                city: 'Shirley Mills',
                countryName: 'United States',
                countryCodeIso2: 'US',
                countryCodeIso3: 'USA',
                countryCodeFips: null,
                countyCode: '23021',
                countyName: 'Piscataquis County',
                createdAt: '2020-07-25T00:32:10.000Z',
                effectiveEndDate: null,
                effectiveStartDate: '2020-07-25T00:32:09.000Z',
                id: 185731,
                internationalPostalCode: null,
                province: null,
                sourceDate: '2020-07-25T00:32:09.000Z',
                sourceSystemUser: null,
                stateCode: 'ME',
                transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
                updatedAt: '2020-07-25T00:32:10.000Z',
                validationKey: null,
                vet360Id: '1273780',
                zipCode: '04485',
                zipCodeSuffix: '4413',
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
                isTextPermitted: null,
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
              homePhone: {
                areaCode: '804',
                countryCode: '1',
                createdAt: '2020-07-25T00:33:15.000Z',
                extension: '17747',
                effectiveEndDate: null,
                effectiveStartDate: '2020-07-25T00:33:14.000Z',
                id: 155101,
                isInternational: false,
                isTextable: null,
                isTextPermitted: null,
                isTty: null,
                isVoicemailable: null,
                phoneNumber: '2055544',
                phoneType: 'HOME',
                sourceDate: '2020-07-25T00:33:14.000Z',
                sourceSystemUser: null,
                transactionId: 'a7299f8e-1646-40f5-988d-61d0480c01dc',
                updatedAt: '2020-07-25T00:33:15.000Z',
                vet360Id: '1273780',
              },
              workPhone: {
                areaCode: '214',
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
                phoneNumber: '7182112',
                phoneType: 'WORK',
                sourceDate: '2020-07-25T00:33:51.000Z',
                sourceSystemUser: null,
                transactionId: 'b98371ec-bfd5-4724-89ee-3ea3c48dac81',
                updatedAt: '2020-07-25T00:33:51.000Z',
                vet360Id: '1273780',
              },
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

// Sets up the responses needed to mack a successful phone number update. In
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
          data: {
            id: '',
            type: 'async_transaction_vet360_telephone_transactions',
            attributes: {
              transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::Vet360::TelephoneTransaction',
              metadata: [],
            },
          },
        }),
      );
    }),
    rest.put(`${prefix}/v0/profile/telephones`, (req, res, ctx) => {
      newAreaCode = req.body.areaCode;
      newPhoneNumber = req.body.phoneNumber;
      return res(
        ctx.json({
          data: {
            id: '',
            type: 'async_transaction_vet360_telephone_transactions',
            attributes: {
              transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
              transactionStatus: 'RECEIVED',
              type: 'AsyncTransaction::Vet360::TelephoneTransaction',
              metadata: [],
            },
          },
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
              services: [
                'facilities',
                'hca',
                'edu-benefits',
                'form-save-in-progress',
                'form-prefill',
                'mhv-accounts',
                'evss-claims',
                'form526',
                'user-profile',
                'appeals-status',
                'id-card',
                'identity-proofed',
                'vet360',
                'evss_common_client',
                'claim_increase',
              ],
              account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
              profile: {
                email: 'vets.gov.user+36@gmail.com',
                firstName: 'WESLEY',
                middleName: 'WATSON',
                lastName: 'FORD',
                birthDate: '1986-05-06',
                gender: 'M',
                zip: '21122-6706',
                lastSignedIn: '2020-07-28T14:57:28.196Z',
                loa: { current: 3, highest: 3 },
                multifactor: true,
                verified: true,
                signIn: {
                  serviceName: 'idme',
                  accountType: 'N/A',
                  ssoe: true,
                  transactionid: '/lob0lmUWabZaaWqJ+ydOKkCYvu55jG3IxIJI4qzGic=',
                },
                authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
              },
              vaProfile: {
                status: 'OK',
                birthDate: '19860506',
                familyName: 'Ford',
                gender: 'M',
                givenNames: ['Wesley', 'Watson'],
                isCernerPatient: false,
                facilities: [{ facilityId: '983', isCerner: false }],
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
                '21-686C',
                '40-10007',
                '22-1990',
                '22-1990N',
                '22-1990E',
                '22-1995',
                '22-1995S',
                '22-5490',
                '22-5495',
                '22-0993',
                '22-0994',
                'FEEDBACK-TOOL',
                '22-10203',
                '21-526EZ',
                '21-526EZ-BDD',
                '1010ez',
                '21P-530',
                '21P-527EZ',
                '686C-674',
                '20-0996',
                'MDOT',
              ],
              vet360ContactInformation: {
                email: {
                  createdAt: '2020-07-28T14:57:54.000Z',
                  emailAddress: newPhoneNumber,
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-28T14:57:53.000Z',
                  id: 114818,
                  sourceDate: '2020-07-28T14:57:53.000Z',
                  sourceSystemUser: null,
                  transactionId: '61ffa9bd-3290-4e4b-9480-d93fd6236dcf',
                  updatedAt: '2020-07-28T14:57:54.000Z',
                  vet360Id: '1273780',
                },
                residentialAddress: {
                  addressLine1: '34 Blanchard Rd',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'RESIDENCE/CHOICE',
                  addressType: 'DOMESTIC',
                  city: 'Shirley Mills',
                  countryName: 'United States',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  countryCodeFips: null,
                  countyCode: '23021',
                  countyName: 'Piscataquis County',
                  createdAt: '2020-07-25T00:32:10.000Z',
                  effectiveEndDate: null,
                  effectiveStartDate: '2020-07-25T00:32:09.000Z',
                  id: 185731,
                  internationalPostalCode: null,
                  province: null,
                  sourceDate: '2020-07-25T00:32:09.000Z',
                  sourceSystemUser: null,
                  stateCode: 'ME',
                  transactionId: '6bde244e-a92f-421f-a7dc-923fc85f4f5f',
                  updatedAt: '2020-07-25T00:32:10.000Z',
                  validationKey: null,
                  vet360Id: '1273780',
                  zipCode: '04485',
                  zipCodeSuffix: '4413',
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
