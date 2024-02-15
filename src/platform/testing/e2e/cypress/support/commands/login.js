import { VA_FORM_IDS } from 'platform/forms/constants';
import { CSP_IDS } from 'platform/user/authentication/constants';

/* eslint-disable camelcase */
const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      account: {
        account_uuid: '777bfa-2cbb-98fc-zz-9231fbac',
      },
      profile: {
        sign_in: {
          service_name: CSP_IDS.DS_LOGON,
          account_type: '2',
          ssoe: false,
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
        authn_context: 'dslogon',
        multifactor: true,
        zip: '21076',
        last_signed_in: '2022-05-18T22:02:02.188Z',
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'lighthouse',
        'form526',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19850101',
        family_name: 'Doe',
        gender: 'F',
        given_names: ['Jane', 'E'],
        active_status: 'active',
        facilities: [
          {
            facility_id: '983',
            isCerner: false,
          },
          {
            facility_id: '984',
            isCerner: false,
          },
        ],
        is_cerner_patient: false,
        va_patient: true,
        mhv_account_state: 'OK',
      },
    },
  },
  meta: { errors: null },
};
/* eslint-enable camelcase */

/**
 * Simulates a logged in session.
 * @param {Object} [userData] - Custom response stub for the user endpoint.
 */
Cypress.Commands.add('login', (userData = mockUser) => {
  window.localStorage.setItem('hasSession', true);
  cy.intercept('GET', '/v0/user', userData).as('mockUser');
});
