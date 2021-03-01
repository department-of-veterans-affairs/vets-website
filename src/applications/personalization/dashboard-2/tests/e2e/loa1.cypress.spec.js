import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import loa1User from '@@profile/tests/fixtures/users/user-loa1.json';

import manifest from 'applications/personalization/dashboard/manifest.json';

import { mockFeatureToggles } from './helpers';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 * @param {array} stubs - array of Cy.stubs that should _not_ be called
 *
 * This helper:
 * - loads the my VA Dashboard,
 * - checks that focus is managed correctly, and performs an aXe scan
 */
function loa1DashboardTest(mobile, stubs) {
  mockFeatureToggles();
  cy.visit(manifest.rootUrl);

  if (mobile) {
    cy.viewport('iphone-4');
  }

  // make sure that the "Verify" alert is shown
  cy.findByText(/Verify your identity to access/i).should('exist');
  cy.findByText(/we need to make sure you’re you/i).should('exist');

  // focus should be on the h1
  cy.focused()
    .should('have.attr', 'id', 'dashboard-title')
    .contains('My VA')
    .and('have.prop', 'tagName')
    .should('equal', 'H1');

  // make sure that we don't call APIs to get name, service history, or disability rating
  cy.should(() => {
    stubs.forEach(stub => {
      expect(stub).not.to.be.called;
    });
  });

  // make sure that the name tag is not visible
  cy.findByTestId('name-tag').should('not.exist');

  // make sure the claims and appeals section is hidden
  cy.findByRole('heading', { name: 'Claims & appeals' }).should('not.exist');

  // make sure that the health care section is hidden
  cy.findByRole('heading', { name: 'Health care' }).should('not.exist');

  // make sure that the apply for benefits section is visible
  cy.findByRole('heading', { name: /apply for benefits/i }).should('exist');

  // make the a11y check
  cy.injectAxe();
  cy.axeCheck();
}

describe('The My VA Dashboard', () => {
  let getServiceHistoryStub;
  let getFullNameStub;
  let getDisabilityRatingStub;
  let stubs;
  beforeEach(() => {
    disableFTUXModals();
    cy.login(loa1User);
    getServiceHistoryStub = cy.stub();
    getFullNameStub = cy.stub();
    getDisabilityRatingStub = cy.stub();
    stubs = [getServiceHistoryStub, getFullNameStub, getDisabilityRatingStub];

    cy.intercept('/v0/profile/service_history', () => {
      getServiceHistoryStub();
    });
    cy.intercept('/v0/profile/full_name', () => {
      getFullNameStub();
    });
    cy.intercept('/v0/disability_compensation_form/rating_info', () => {
      getDisabilityRatingStub();
    });
  });
  it('should handle LOA1 users at desktop size', () => {
    loa1DashboardTest(false, stubs);
  });

  it('should handle LOA1 users at mobile phone size', () => {
    loa1DashboardTest(true, stubs);
  });
});
