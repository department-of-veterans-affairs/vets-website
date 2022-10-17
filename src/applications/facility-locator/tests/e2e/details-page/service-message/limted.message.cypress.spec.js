import facilityData from './mocks/limited.message.json';

describe('Facility VA -- Details page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', facilityData).as('facilityData');
  });

  it('renders limited message on detail page', () => {
    cy.visit('/find-locations/facility/vc_0304V');
    cy.injectAxeThenAxeCheck();
    // get message
    cy.get('.hydrated > h2').should('be.visible');
    cy.get('.hydrated > h2').should('contain', 'Limited services and hours');
    cy.get('[data-testid="status-description"] > p').should('be.visible');
    cy.get('[data-testid="status-description"] > p').should(
      'contain',
      "We're currently open for limited in-person service, and",
    );
  });
});
