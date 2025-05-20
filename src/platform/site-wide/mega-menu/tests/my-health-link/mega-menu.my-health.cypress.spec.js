import features from '~/platform/utilities/tests/header-footer/mocks/features';

describe('My HealtheVet on VA.gov', () => {
  beforeEach(() => {
    // Add cache-busting headers
    cy.intercept('**/*', req => {
      req.reply(res => {
        res.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
        res.headers.pragma = 'no-cache';
        res.headers.expires = '0';
      });
    });
  });

  it('shows the VA.gov link', () => {
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
});
