import features from '~/platform/utilities/tests/header-footer/mocks/features';

describe('My HealtheVet on VA.gov', () => {
  it('shows the VA.gov link once the profile has loaded', () => {
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

  it('hides My VA and My HealtheVet links in the mega menu while the profile is loading', () => {
    cy.intercept('/v0/feature_toggles*', features).as('features');
    cy.intercept('GET', '/v0/user', req => {
      // eslint-disable-next-line no-param-reassign
      req.reply(new Promise(() => {}));
    }).as('pendingProfile');

    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();

    cy.get('[data-e2e-id^="my-va-"]').should('not.exist');
    cy.get('[data-e2e-id^="my-healthe-vet-"]').should('not.exist');
  });
});
