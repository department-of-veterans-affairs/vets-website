import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-36.json';
import mockPaymentInfo from '../fixtures/payment-information/direct-deposit-is-set-up.json';
import mockFeatureToggles from '../fixtures/feature-toggles.json';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the Profile, confirms the user is redirected to the correct URL, and
 *   then performs an aXe scan
 * - clicks through each item in the sub-nav, checks that the URL is correct,
 *   and performs an aXe scan
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
  // ProfileHeader should not be rendered on the page
  cy.findByTestId('profile-header').should('not.exist');

  // visiting /profile should redirect to profile/personal-information
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );

  // make the a11y check on the Personal Info section
  cy.injectAxe();
  cy.axeCheck();

  // make the  a11y check on the Military Info section
  if (mobile) {
    cy.findByRole('button', { name: /your profile menu/i }).click();
  }
  cy.findByRole('link', { name: 'Military information' }).click();
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.MILITARY_INFORMATION}`,
  );
  cy.axeCheck();

  // make the a11y check on the Direct Deposit section
  if (mobile) {
    cy.findByRole('button', { name: /your profile menu/i }).click();
  }
  cy.findByRole('link', { name: 'Direct deposit' }).click();
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
  );
  cy.axeCheck();

  // make the a11y check on the Account Security section
  if (mobile) {
    cy.findByRole('button', { name: /your profile menu/i }).click();
  }
  cy.findByRole('link', { name: 'Account security' }).click();
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
  );
  cy.axeCheck();

  // make the a11y check on the Connected Apps section
  if (mobile) {
    cy.findByRole('button', { name: /your profile menu/i }).click();
  }
  cy.findByRole('link', { name: 'Connected apps' }).click();
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.CONNECTED_APPLICATIONS}`,
  );
  cy.axeCheck();
}

describe('Profile', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login(mockUser);
    // login() calls cy.server() so we can now mock routes
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.route('GET', '/v0/ppiu/payment_information', mockPaymentInfo);
  });
  it('should pass an aXe scan on all pages at desktop size', () => {
    checkAllPages(false);
  });

  it('should pass an aXe scan on all pages at mobile phone size', () => {
    checkAllPages(true);
  });
});
