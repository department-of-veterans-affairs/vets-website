describe('Representatives', () => {
  const togglePortal = value => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [{ name: 'representatives_portal_frontend', value }],
        },
      });
    });
  };

  describe('when feature is toggled off', () => {
    togglePortal(false);

    it('gates', () => {
      cy.visit('/representatives');
      cy.injectAxe();
      cy.axeCheck();

      cy.location('pathname').should('equal', '/');
    });
  });

  describe('when feature is toggled on', () => {
    togglePortal(true);

    it('allows navigation from landing page to dashboard to poa requests', () => {
      cy.visit('/representatives');
      cy.injectAxe();
      cy.axeCheck();

      cy.contains('Welcome to Representative.VA.gov');
      cy.contains('Until sign in is added use this to see dashboard').click();

      cy.url().should('include', '/representatives/dashboard');
      cy.axeCheck();

      cy.contains('Accredited Representative Portal');
      cy.contains('View all').click();

      cy.url().should('include', '/representatives/poa-requests');
      cy.axeCheck();

      cy.contains('Power of attorney requests');
      cy.get('[data-testid=poa-requests-table]').should('exist');
    });

    it('allows navigation from landing page to unified sign-in page', () => {
      cy.visit('/representatives');
      cy.injectAxe();
      cy.axeCheck();

      cy.contains('Sign in or create an account').click();
      cy.url().should('include', '/sign-in/?application=arp&oauth=true');
    });
  });
});
