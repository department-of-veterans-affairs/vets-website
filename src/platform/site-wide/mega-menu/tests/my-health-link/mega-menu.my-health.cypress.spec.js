import features from '~/platform/utilities/tests/header-footer/mocks/features';

describe('My HealtheVet on VA.gov', () => {
  it('shows the new link when enabled', () => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
    cy.get('[data-e2e-id^="my-healthe-vet-"]').should(
      'have.attr',
      'href',
      '/my-health/',
    );
  });

  it('shows the old link when disabled', () => {
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('be.visible')
      .and('have.text', 'My HealtheVet');
    cy.get('[data-e2e-id^="my-healthe-vet-"]')
      .should('have.attr', 'href')
      .and('include', 'mhv-portal-web/eauth');
  });
});
