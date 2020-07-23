import { PROFILE_PATHS } from '../../constants';

import mockUser from '../fixtures/users/user-non-vet.json';
import mockPaymentInfo from '../fixtures/payment-information/direct-deposit-is-set-up.json';
import mockFeatureToggles from '../fixtures/feature-toggles.json';

describe('Non-Veterans', () => {
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
  it('should not have Military Info in the sub-nav and should be blocked from directly accessing that route', () => {
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');

    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');

    // visiting /profile should redirect to profile/personal-information
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
    );

    // There should not be a Military Information item in the sub nav
    cy.findByRole('link', { name: /military info/i }).should('not.exist');

    // TODO: maybe add tests to make sure the sub nav has the correct items?

    // Going directly to the military info section should redirect to the
    // personal info section
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
    );
  });
});
