const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,
  'GET /v0/user': {
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
          'user-profile',
          'appeals-status',
          'identity-proofed',
        ],
        account: { accountUuid: '4024a1ac-2a79-4c1a-a20d-4d15618757ca' },
        profile: {
          email: 'vets.gov.user+0@gmail.com',
          firstName: 'HECTOR',
          middleName: 'J',
          lastName: 'ALLEN',
          birthDate: '1932-02-05',
          gender: 'M',
          zip: '20110',
          lastSignedIn: '2022-01-10T19:57:45.590Z',
          loa: { current: 3, highest: 3 },
          multifactor: true,
          verified: true,
          signIn: { serviceName: 'idme', accountType: 'N/A' },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19320205',
          familyName: 'Allen',
          gender: 'M',
          givenNames: ['Hector'],
          isCernerPatient: false,
          facilities: [{ facilityId: '500', isCerner: false }],
          vaPatient: true,
          mhvAccountState: 'NONE',
        },
        veteranStatus: null,
        inProgressForms: [],
        prefillsAvailable: ['22-1990EZ'],
        vet360ContactInformation: {},
        session: {
          ssoe: true,
          transactionid: 'sf8mUOpuAoxkx8uWxI6yrBAS/t0yrsjDKqktFz255P0=',
        },
      },
    },
    meta: {
      errors: [],
    },
  },
  'GET /meb_api/v0/claim_status?latest=true': {
    claimStatus: {
      claimStatus: 'ELIGIBLE',
      receivedDate: '2020-12-12',
    },
    metadata: {
      version: 0,
      prefill: false,
      returnUrl: '/download-letters/letters',
    },
  },
  'GET /meb_api/v0/forms_claim_status?latest=true': {
    claimStatus: {
      claimStatus: 'ELIGIBLE',
      receivedDate: '2021-01-23',
    },
    metadata: {
      version: 0,
      prefill: false,
      returnUrl: '/download-letters/letters',
    },
  },
};
