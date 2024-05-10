import { setIsAppEnabled, setIsInPilot } from './intercepts/feature-toggles';

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is not enabled', () => {
    // During CI, the environment is production, so we can test our global
    // feature toggling behavior there. But when running this test locally, the
    // environment is localhost, so we can't test our global feature toggling
    // behavior there without doing some more complex test setup.
    beforeEach(function skipOutsideCI() {
      if (!Cypress.env('CI')) {
        this.skip();
      }

      setIsAppEnabled(false);

      cy.visit('/representative');

      cy.injectAxe();
    });

    it('re-routes to VA.gov homepage', () => {
      cy.axeCheck();

      cy.location('pathname').should('equal', '/');
    });
  });

  describe('App feature toggle is enabled, but Pilot feature toggle is not enabled', () => {
    beforeEach(function skipOutsideCI() {
      if (!Cypress.env('CI')) {
        this.skip();
      }

      setIsAppEnabled(true);
      setIsInPilot(false);

      cy.visit('/representative');

      cy.injectAxe();
    });

    it('allows navigation from the Landing Page to unified sign-in page', () => {
      cy.axeCheck();

      cy.get('[data-testid=landing-page-sign-in-link]')
        .contains('Sign in or create account')
        .click();
      cy.location('pathname').should('equal', '/sign-in/');
    });

    it('displays error as content if not in pilot', () => {
      cy.axeCheck();

      cy.get('[data-testid=not-in-pilot-error]').should('exist');
      cy.get('[data-testid=not-in-pilot-error-heading]').should(
        'have.text',
        'Accredited Representative Portal is currently in pilot and not available to all users.',
      );
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      setIsAppEnabled(true);
      setIsInPilot(true);

      cy.visit('/representative');

      cy.injectAxe();
    });

    it('allows navigation from the Landing Page to the POA Requests Page and back', () => {
      cy.axeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();

      cy.location('pathname').should('equal', '/representative/poa-requests');
      cy.axeCheck();

      cy.get('[data-testid=poa-requests-heading]').should(
        'have.text',
        'Power of attorney requests',
      );
      cy.get('[data-testid=poa-requests-table]').should('exist');

      cy.get('[data-testid=wider-than-mobile-logo-row-logo-link]').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });
  });
});
