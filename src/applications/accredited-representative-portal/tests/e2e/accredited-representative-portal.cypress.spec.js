const featureIsEnabled = value => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [{ name: 'accredited_representative_portal_frontend', value }],
    },
  });
};

describe('Accredited Representative Portal', () => {
  describe('Feature toggle not enabled', () => {
    beforeEach(function skipOutsideCI() {
      if (!Cypress.env('CI')) {
        this.skip();
      }
      featureIsEnabled(false);
    });

    it('does not allow navigation to the Portal when feature is not enabled', () => {
      // During CI, the environment is production, so we can test our global
      // feature toggling behavior there. But when running this test locally, the
      // environment is localhost, so we can't test our global feature toggling
      // behavior there without doing some more complex test setup.
      cy.visit('/representative');
      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should('equal', '/');
    });
  });

  describe('Feature toggle enabled - Navigation from Landing Page to pages and back', () => {
    beforeEach(() => {
      featureIsEnabled(true);
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
