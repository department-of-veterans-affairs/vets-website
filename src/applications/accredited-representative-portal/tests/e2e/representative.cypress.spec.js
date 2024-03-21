const togglePortal = value => {
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
        cy.visit('/representative');
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
    cy.visit('/representative');
    cy.injectAxe();
    cy.axeCheck();

    cy.location('pathname').should('equal', '/representative');
  });

  it('allows navigation from the Landing Page to unified sign-in page', () => {
    cy.visit('/representative');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid=landing-sign-in-link]')
      .contains('Sign in or create an account')
      .click();
    cy.location('pathname').should(
      'contain',
      '/sign-in/?application=arp&oauth=true',
    );
  });

  it('allows navigation from the Landing Page to the Dashboard Page and back', () => {
    cy.visit('/representative');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid=landing-heading]').should(
      'equal',
      'Welcome to the Accredited Representative Portal',
    );
    cy.get('[data-testid=landing-bypass-sign-in-link]').click();

    cy.location('pathname').should('equal', '/representative/dashboard');
    cy.axeCheck();

    cy.get('[data-testid=dashboard-heading]').should(
      'equal',
      'Accredited Representative Portal',
    );

    cy.get('[data-testid=home-breadcrumb]').click();
    cy.get('[data-testid=landing-heading]').should(
      'equal',
      'Welcome to the Accredited Representative Portal',
    );
  });

  it('allows navigation from the Dashboard Page to the POA Requests Page and back', () => {
    cy.visit('/representative/dashboard');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid=dashboard-heading]').should(
      'equal',
      'Accredited Representative Portal',
    );
    cy.get('[data-testid=view-all-poa-requests-link]').click();

    cy.location('pathname').should('equal', '/representative/poa-requests');
    cy.axeCheck();

    cy.get('[data-testid=poa-requests-heading]').should(
      'equal',
      'Power of attorney requests',
    );
    cy.get('[data-testid=poa-requests-table]').should('exist');

    cy.get('[data-testid=dashboard-breadcrumb]').click();
    cy.get('[data-testid=dashboard-heading]').should(
      'equal',
      'Accredited Representative Portal',
    );
  });

  it('allows navigation from the Dashboard Page to the Permissions Page and back', () => {
    cy.visit('/representative/dashboard');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid=dashboard-heading]').should(
      'equal',
      'Accredited Representative Portal',
    );
    cy.get('[data-testid=permissions-sidenav-item]').click();

    cy.location('pathname').should('equal', '/representative/permissions');
    cy.axeCheck();

    cy.get('[data-testid=permissions-heading]').should('equal', 'Permissions');

    cy.get('[data-testid=dashboard-breadcrumb]').click();
    cy.get('[data-testid=dashboard-heading]').should(
      'equal',
      'Accredited Representative Portal',
    );
  });
});
