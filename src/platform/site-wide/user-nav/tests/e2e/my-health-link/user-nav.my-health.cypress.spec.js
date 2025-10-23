import features from '~/platform/utilities/tests/header-footer/mocks/features';

describe('My HealtheVet on VA.gov', () => {
  it('shows the VA.gov link', () => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.my-health-link').should('have.attr', 'href', '/my-health/');
  });
});
