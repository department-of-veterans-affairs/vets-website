import { setFeatureToggles } from './intercepts/feature-toggles';

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is not enabled', () => {
    beforeEach(() => {
      setFeatureToggles({
        isAppEnabled: false,
        isInPilot: false,
      });

      cy.visit('/representative');

      cy.injectAxe();
    });

    it('displays an error if app is not enabled', () => {
      cy.axeCheck();

      cy.get('[data-testid=app-not-enabled-alert]').should('exist');
      cy.get('[data-testid=app-not-enabled-alert-heading]').should(
        'have.text',
        'The Accredited Representative Portal is not available yet',
      );
    });
  });

  describe('App feature toggle is enabled, but Pilot feature toggle is not enabled', () => {
    beforeEach(() => {
      setFeatureToggles({
        isAppEnabled: true,
        isInPilot: false,
      });

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

    it('displays an alert if user is not in pilot', () => {
      cy.axeCheck();

      cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();
      cy.get('[data-testid=not-in-pilot-alert]').should('exist');
      cy.get('[data-testid=not-in-pilot-alert-heading]').should(
        'have.text',
        'Accredited Representative Portal is currently in pilot',
      );
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      setFeatureToggles({
        isAppEnabled: true,
        isInPilot: true,
      });

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
