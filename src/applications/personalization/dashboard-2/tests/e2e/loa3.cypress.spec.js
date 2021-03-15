import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';

import manifest from 'applications/personalization/dashboard/manifest.json';

import { mockFeatureToggles } from './helpers';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the my VA Dashboard,
 *   checks that focus is managed correctly, and performs an aXe scan
 */
function loa3DashboardTest(mobile) {
  mockFeatureToggles();
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByRole('progressbar').should('not.exist');
  cy.findByText(/loading your information/i).should('not.exist');

  // focus should be on the h1
  cy.focused()
    .should('have.attr', 'id', 'dashboard-title')
    .contains('My VA')
    .and('have.prop', 'tagName')
    .should('equal', 'H1');

  // name tag exists with the right data
  cy.findByTestId('name-tag').should('exist');
  cy.findByText('Wesley Watson Ford').should('exist');
  cy.findByText('United States Air Force').should('exist');
  cy.findByText('90% Service connected').should('exist');

  // make the a11y check
  cy.injectAxe();
  cy.axeCheck();
}

describe('The My VA Dashboard', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });
  it('should handle LOA3 users at desktop size', () => {
    loa3DashboardTest(false);
  });

  it('should handle LOA3 users at mobile phone size', () => {
    loa3DashboardTest(true);
  });
});
