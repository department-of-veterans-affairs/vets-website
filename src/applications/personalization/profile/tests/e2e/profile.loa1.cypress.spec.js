import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '../../constants';

import mockLOA1User from '../fixtures/users/user-loa1.json';

describe('LOA1 users', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockLOA1User);
    // login() calls cy.server() so we can now mock routes
  });
  it('should only have access to the Account Security section', () => {
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

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

    // Check that the sub nav does not contain anything other than the Account
    // Security section
    cy.findByRole('link', { name: /personal.*info/i }).should('not.exist');
    cy.findByRole('link', { name: /military info/i }).should('not.exist');
    cy.findByRole('link', { name: /direct deposit/i }).should('not.exist');
    cy.findByRole('link', { name: /connected app/i }).should('not.exist');

    // There should be an Account Security item in the sub nav.
    // NOTE: There are two link elements that contain `account security` so look
    // for the link specifically in the secondary nav
    cy.findByRole('navigation', { name: /secondary/i }).within(() => {
      cy.findByRole('link', { name: /account security/i }).should('exist');
    });

    // Going directly to any other should redirect to the
    // account security section
    [
      PROFILE_PATHS.CONNECTED_APPLICATIONS,
      PROFILE_PATHS.DIRECT_DEPOSIT,
      PROFILE_PATHS.MILITARY_INFORMATION,
      PROFILE_PATHS.PERSONAL_INFORMATION,
    ].forEach(path => {
      cy.visit(path);
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
      );
    });
  });
});
