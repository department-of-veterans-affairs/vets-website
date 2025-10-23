import facilityData from './mocks/no.message.json';

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
    cy.get('.hydrated > h2').should('not.exist');
  });
});
