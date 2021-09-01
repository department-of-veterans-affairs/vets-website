import { PROFILE_PATHS } from '../../constants';

import mockUserNotInMPI from '../fixtures/users/user-not-in-mpi.json';

import {
  mockGETEndpoints,
  onlyAccountSecuritySectionIsAccessible,
  subNavOnlyContainsAccountSecurity,
} from './helpers';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 */
function test(mobile = false) {
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByRole('progressbar').should('not.exist');
  cy.findByText(/loading your information/i).should('not.exist');

  // should redirect to profile/account-security on load
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );

  // Should show a "not in MPI" error
  cy.findByText(/We’re having trouble verifying your identity/i)
    .should('exist')
    .closest('.usa-alert-warning')
    .should('exist');
  cy.findByText(/we can’t give you access to VA.gov tools/i)
    .should('exist')
    .closest('.usa-alert-warning')
    .should('exist');

  subNavOnlyContainsAccountSecurity(mobile);

  onlyAccountSecuritySectionIsAccessible();
}

describe('When user is LOA3 with 2FA turned on but we cannot connect to MPI', () => {
  beforeEach(() => {
    cy.login(mockUserNotInMPI);
    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/ch33_bank_accounts',
      'v0/profile/full_name',
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/disability_compensation_form/rating_info',
      'v0/feature_toggles*',
    ]);
  });
  it('should only have access to the Account Security section at desktop size', () => {
    test();
  });
  it('should only have access to the Account Security section at mobile size', () => {
    test(true);
  });
});
