import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import mockPaymentInfo from '../fixtures/dd4cnp/dd4cnp-is-set-up.json';

function clickSubNavButton(buttonLabel, mobile) {
  if (mobile) {
    cy.findByRole('button', { name: /profile menu/i }).click();
  }
  cy.findByRole('link', { name: buttonLabel }).click();
}

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the Profile, confirms the user is redirected to the correct URL,
 *   performs an aXe scan, and checks that focus is managed correctly
 * - clicks through each item in the sub-nav and:
 *   - checks that the URL is correct
 *   - checks that the document title is correct
 *   - performs an aXe scan
 *   - checks that focus is managed correctly
 */
function checkAllPages(mobile = false) {
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

  // since we did not mock the `GET profile/full_name` endpoint, the
  // NameTag should not be rendered on the page
  cy.findByTestId('name-tag').should('not.exist');

  // visiting /profile should redirect to profile/personal-information
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );
  cy.title().should(
    'eq',
    'Personal And Contact Information | Veterans Affairs',
  );

  // focus should be on the sub-nav's h1 when redirected from /profile/
  cy.focused()
    .contains(/profile/i)
    .and('have.prop', 'tagName')
    .should('eq', 'H1');

  // make the a11y check on the Personal Info section
  cy.injectAxe();
  cy.axeCheck();

  // make the a11y and focus management check on the Military Info section
  clickSubNavButton(PROFILE_PATH_NAMES.MILITARY_INFORMATION, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.MILITARY_INFORMATION}`,
  );
  cy.title().should('eq', 'Military Information | Veterans Affairs');
  cy.axeCheck();
  // focus should be on the section's h2
  cy.focused()
    .contains(PROFILE_PATH_NAMES.MILITARY_INFORMATION)
    .and('have.prop', 'tagName')
    .should('eq', 'H2');

  // make the a11y and focus management check on the Direct Deposit section
  clickSubNavButton(PROFILE_PATH_NAMES.DIRECT_DEPOSIT, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
  );
  cy.title().should('eq', 'Direct Deposit | Veterans Affairs');
  cy.axeCheck();
  // focus should be on the section's h2
  cy.focused()
    .contains(PROFILE_PATH_NAMES.DIRECT_DEPOSIT)
    .and('have.prop', 'tagName')
    .should('eq', 'H2');

  // make the a11y and focus management check on the Account Security section
  clickSubNavButton(PROFILE_PATH_NAMES.ACCOUNT_SECURITY, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );
  cy.title().should('eq', 'Account Security | Veterans Affairs');
  cy.axeCheck();
  // focus should be on the section's h2
  cy.focused()
    .contains(PROFILE_PATH_NAMES.ACCOUNT_SECURITY)
    .and('have.prop', 'tagName')
    .should('eq', 'H2');

  // make the a11y and focus management check on the Connected Apps section
  clickSubNavButton(PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONNECTED_APPLICATIONS}`,
  );
  cy.title().should('eq', 'Connected Apps | Veterans Affairs');
  // wait for this section's loading spinner to disappear...
  cy.findByRole('progressbar').should('not.exist');
  cy.axeCheck();
  // focus should be on the section's h2
  cy.focused()
    .contains(PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS)
    .and('have.prop', 'tagName')
    .should('eq', 'H2');

  // navigate directly to the Personal and Contact Info section via the sub-nav to confirm focus is managed correctly
  clickSubNavButton(PROFILE_PATH_NAMES.PERSONAL_INFORMATION, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );
  cy.focused()
    .contains(PROFILE_PATH_NAMES.PERSONAL_INFORMATION)
    .and('have.prop', 'tagName')
    .should('eq', 'H2');
}

describe('Profile', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
    // login() calls cy.server() so we can now mock routes
    cy.route('GET', '/v0/ppiu/payment_information', mockPaymentInfo);
  });
  it('should pass an aXe scan and manage focus on all pages at desktop size', () => {
    checkAllPages(false);
  });

  it('should pass an aXe scan and manage focus on all pages at mobile phone size', () => {
    checkAllPages(true);
  });
});
