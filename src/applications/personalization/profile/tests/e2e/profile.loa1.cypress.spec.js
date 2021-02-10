import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '../../constants';

import mockLOA1User from '../fixtures/users/user-loa1.json';

import {
  onlyAccountSecuritySectionIsAccessible,
  subNavOnlyContainsAccountSecurity,
} from './helpers';

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

    subNavOnlyContainsAccountSecurity();

    onlyAccountSecuritySectionIsAccessible();
  });
});
