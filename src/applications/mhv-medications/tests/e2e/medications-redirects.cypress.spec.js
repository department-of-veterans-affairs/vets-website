import MedicationsSite from './med_site/MedicationsSite';
import mockUserNoMhvAccount from './fixtures/user-mhv-account-state-none.json';

let site;

describe('Medications redirects', () => {
  beforeEach(() => {
    site = new MedicationsSite();
    site.mockFeatureToggles();
    site.mockVamcEhr();

    cy.intercept('/?next=*', cy.spy().as('rootPath')).as(
      'unauthenticatedRedirect',
    );

    cy.intercept('/my-health', cy.spy().as('myHealthPath')).as(
      'myHealthRedirect',
    );

    cy.intercept(
      '/my-health/medications/about',
      cy.spy().as('staticPagePath'),
    ).as('staticPageRedirect');
  });

  describe('as an unauthenticated user', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects the user to /?next=* and prompts to sign in', () => {
      cy.visit('/my-health/medications');
      cy.wait(['@featureToggles', '@vamcEhr', '@unauthenticatedRedirect']);
      cy.get('@rootPath').should('have.been.called');
    });
  });

  describe('as an authenticated user without an associated MHV account', () => {
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('redirects the user to /my-health to render an alert', () => {
      cy.login(mockUserNoMhvAccount);
      cy.visit('/my-health/medications');
      cy.wait([
        '@featureToggles',
        '@vamcEhr',
        '@mockUser',
        '@myHealthRedirect',
      ]);
      cy.get('@myHealthPath').should('have.been.called');
      cy.get('@staticPagePath').should('have.not.been.called');
    });
  });
});
