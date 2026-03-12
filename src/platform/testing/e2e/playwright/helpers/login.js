/* eslint-disable camelcase */
/**
 * Playwright login helper.
 *
 * Simulates a logged-in session by setting localStorage and mocking
 * the /v0/user endpoint, mirroring the Cypress `cy.login()` command.
 */

const defaultMockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      account: {
        account_uuid: '777bfa-2cbb-98fc-zz-9231fbac',
      },
      profile: {
        sign_in: {
          service_name: 'dslogon',
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
      in_progress_forms: [],
      prefills_available: [],
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
          { facility_id: '983', isCerner: false },
          { facility_id: '984', isCerner: false },
        ],
        is_cerner_patient: false,
        va_patient: true,
        mhv_account_state: 'OK',
      },
    },
  },
  meta: { errors: null },
};

/**
 * Sets up a mock logged-in session for a Playwright page.
 * - Sets `hasSession` in localStorage via addInitScript
 * - Mocks the /v0/user endpoint with the provided or default user data
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [userData] - Custom user response data
 */
async function login(page, userData = defaultMockUser) {
  // Set localStorage before the page loads
  await page.addInitScript(() => {
    window.localStorage.setItem('hasSession', true);
  });

  // Mock the user endpoint
  await page.route('**/v0/user', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userData),
    }),
  );
}

module.exports = { login, defaultMockUser };
