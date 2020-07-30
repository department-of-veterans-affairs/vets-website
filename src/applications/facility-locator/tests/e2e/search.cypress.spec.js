import path from 'path';

describe('Facility Search', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/feature_toggles?*', []);
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route('GET', '/v0/facilities/va?*', 'fx:constants/mock-facility-data');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
  });

  it('displays search results header after searching', () => {
    cy.visit(
      '/find-locations/?address=new%20york&context=New%20York%2C%20New%20York%2C%20United%20States&facilityType=health&location=40.7648%2C-73.9808',
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-search-results').should('exist');
  });

  it('does not show search result header if no results are found', () => {
    cy.visit('/find-locations?fail=true');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-search-results').should('not.exist');
  });
});
