import { PROFILE_PATHS } from '../../constants';

import mockFeatureToggles from '../fixtures/feature-toggles.json';

import mockUserNotInEVSS from '../fixtures/users/user-non-vet.json';

describe('Military Information', () => {
  function confirmMilitaryInformationIsBlocked() {
    // the Military Info item should not exist in the sub nav
    cy.findByRole('navigation', { name: /secondary/i }).within(() => {
      // Just a test to make sure we can access items in the sub nav to ensure
      // the following test isn't a false negative
      cy.findByText(/personal.*info/i).should('exist');
      cy.findByRole('link', { name: /military information/i }).should(
        'not.exist',
      );
    });

    // going directly to Military Info should redirect to the personal info page
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
    );
  }
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login();
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
  });
  it('should be blocked if the user is not a Veteran', () => {
    cy.route('GET', 'v0/user', mockUserNotInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // TODO: add test to make sure that GET service_history is not called?

    confirmMilitaryInformationIsBlocked();
  });
});
