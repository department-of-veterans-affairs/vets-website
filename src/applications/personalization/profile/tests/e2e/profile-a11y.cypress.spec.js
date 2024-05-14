import mockProfileEnhancementsToggles from '@@profile/tests/fixtures/personal-information-feature-toggles.json';
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
 * - loads the personal information page, since that is the first page in the sub-nav
 *   performs an aXe scan, and checks that focus is managed correctly
 * - clicks through each item in the sub-nav and:
 *   - checks that the URL is correct
 *   - checks that the document title is correct
 *   - performs an aXe scan
 *   - checks that focus is managed correctly
 */
function checkSubNavFocus(mobile = false) {
  cy.intercept('v0/feature_toggles*', mockProfileEnhancementsToggles);
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');

  // since we did not mock the `GET profile/full_name` endpoint, the
  // NameTag should not be rendered on the page
  cy.findByTestId('name-tag').should('not.exist');

  // visiting /profile should redirect to profile/personal-information
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );
  cy.title().should('eq', 'Personal Information | Veterans Affairs');

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

  // make the a11y and focus management check on the Direct Deposit section
  clickSubNavButton(PROFILE_PATH_NAMES.DIRECT_DEPOSIT, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
  );
  cy.title().should('eq', 'Direct Deposit Information | Veterans Affairs');
  cy.axeCheck();

  // make the a11y and focus management check on the Account Security section
  clickSubNavButton(PROFILE_PATH_NAMES.ACCOUNT_SECURITY, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );
  cy.title().should('eq', 'Account Security | Veterans Affairs');
  cy.axeCheck();

  // make the a11y and focus management check on the Connected Apps section
  clickSubNavButton(PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONNECTED_APPLICATIONS}`,
  );
  cy.title().should('eq', 'Connected Apps | Veterans Affairs');
  // wait for this section's loading spinner to disappear...
  cy.findByTestId('connected-apps-loading-indicator').should('not.exist');
  cy.axeCheck();

  // navigate directly to the Personal Info section via the sub-nav to confirm focus is managed correctly
  clickSubNavButton(PROFILE_PATH_NAMES.PERSONAL_INFORMATION, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );

  // navigate directly to the Contact Info section via the sub-nav to confirm focus is managed correctly
  clickSubNavButton(PROFILE_PATH_NAMES.CONTACT_INFORMATION, mobile);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONTACT_INFORMATION}`,
  );
}

describe('Profile Navigation - Accessibility', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPaymentInfo);
  });
  it('check focus for navigating between profile pages via menu on desktop', () => {
    checkSubNavFocus(false);
  });

  it('check focus for navigating between profile pages via menu on mobile', () => {
    checkSubNavFocus(true);
  });
});
