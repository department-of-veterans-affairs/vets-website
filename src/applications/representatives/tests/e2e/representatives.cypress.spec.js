const togglePortal = value => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'representatives_portal_frontend', value }],
      },
    });
  });
};

describe('Representatives', () => {
  describe('feature toggling in production', () => {
    // During CI, the environment is production, so we can test our global
    // feature toggling behavior there. But when running this test locally, the
    // environment is localhost, so we can't test our global feature toggling
    // behavior there without doing some more complex test setup.
    before(function skipOutsideCI() {
      if (!Cypress.env('CI')) {
        this.skip();
      }
    });

    describe('when feature is toggled off', () => {
      togglePortal(false);

      it('does redirect to root', () => {
        cy.visit('/representatives');
        cy.injectAxe();
        cy.axeCheck();

        cy.location('pathname').should('equal', '/');
      });
    });
  });

  // In CI, the feature toggle applies so we need to toggle it on to test
  // behavior past the guard. On localhost, the feature toggle doesn't apply so
  // toggling the feature on is redundant.
  togglePortal(true);

  it('does not redirect to root', () => {
    cy.visit('/representatives');
    cy.injectAxe();
    cy.axeCheck();

    cy.location('pathname').should('equal', '/representatives/');
  });

  it('allows navigation from landing page to unified sign-in page', () => {
    cy.visit('/representatives');
    cy.injectAxe();
    cy.axeCheck();

    cy.contains('Sign in or create an account').click();
    cy.url().should('include', '/sign-in/?application=arp&oauth=true');
  });

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
});
