import features from '~/platform/utilities/tests/header-footer/mocks/features';

describe('My HealtheVet on VA.gov', () => {
  it('shows the VA.gov link once the profile has loaded', () => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.my-health-link').should('have.attr', 'href', '/my-health/');
  });

  it('hides the My HealtheVet link while the profile is loading', () => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('GET', '/v0/user', req => {
      // eslint-disable-next-line no-param-reassign
      req.reply(new Promise(() => {}));
    }).as('pendingProfile');

    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.my-health-link').should('not.exist');
  });
});
