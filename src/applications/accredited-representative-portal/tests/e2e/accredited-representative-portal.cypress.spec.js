const featureIsEnabled = value => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'accredited_representative_portal_frontend', value },
        ],
      },
    });
  });
};

describe('Accredited Representative Portal', () => {
  beforeEach(() => {
    cy.visit('/representative');
  });

  describe('Feature toggling', () => {
    it('does not allow navigation to the Portal when feature is not enabled', () => {
      // During CI, the environment is production, so we can test our global
      // feature toggling behavior there. But when running this test locally, the
      // environment is localhost, so we can't test our global feature toggling
      // behavior there without doing some more complex test setup.
      if (!Cypress.env('CI')) {
        this.skip();
      }
      featureIsEnabled(false);

      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should('equal', '/');
    });

    // In CI, the feature toggle applies so we need to toggle it on to test
    // behavior past the guard. On localhost, the feature toggle doesn't apply so
    // toggling the feature on is redundant.

    it('allows navigation to the Portal when feature is enabled', () => {
      featureIsEnabled(true);

      cy.injectAxe();
      cy.axeCheck();
      cy.location('pathname').should('equal', '/representative/');
    });
  });

  describe('Navigation from Landing Page to pages and back', () => {
    beforeEach(() => {
      featureIsEnabled(true);
    });

    it('allows navigation from the Landing Page to unified sign-in page', () => {
      cy.injectAxe();
      cy.axeCheck();

      cy.get('[data-testid=landing-page-sign-in-link]')
        .contains('Sign in or create an account')
        .click();
      cy.location('pathname').should('equal', '/sign-in/');
    });

    it('allows navigation from the Landing Page to the Dashboard Page and back', () => {
      cy.injectAxe();
      cy.axeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();

      cy.location('pathname').should('equal', '/representative/dashboard');
      cy.axeCheck();

      cy.get('[data-testid=dashboard-heading]').should(
        'have.text',
        'Accredited Representative Portal',
      );

      cy.get('[data-testid=breadcrumbs-home]').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });

    it('allows navigation from the Landing Page to the Dashboard Page to the POA Requests Page and back', () => {
      cy.injectAxe();
      cy.axeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();

      cy.get('[data-testid=dashboard-heading]').should(
        'have.text',
        'Accredited Representative Portal',
      );
      cy.get('[data-testid=poa-requests-widget-view-all-link]').click();

      cy.location('pathname').should('equal', '/representative/poa-requests');
      cy.axeCheck();

      cy.get('[data-testid=poa-requests-heading]').should(
        'have.text',
        'Power of attorney requests',
      );
      cy.get('[data-testid=poa-requests-table]').should('exist');

      cy.get('[data-testid=breadcrumbs-home]').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });

    it('allows navigation from the Landing Page to the Dashboard Page to the Permissions Page and back', () => {
      cy.injectAxe();
      cy.axeCheck();

      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
      cy.get('[data-testid=landing-page-bypass-sign-in-link]').click();

      cy.get('[data-testid=dashboard-heading]').should(
        'have.text',
        'Accredited Representative Portal',
      );
      cy.get('[data-testid=sidenav-permissions-item]').click();

      cy.location('pathname').should('equal', '/representative/permissions');
      cy.axeCheck();

      cy.get('[data-testid=permissions-page-heading]').should(
        'have.text',
        'Permissions',
      );

      cy.get('[data-testid=breadcrumbs-home]').click();
      cy.get('[data-testid=landing-page-heading]').should(
        'have.text',
        'Welcome to the Accredited Representative Portal',
      );
    });
  });
});
