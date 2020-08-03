import path from 'path';
import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';

describe('Facility smoke test', () => {
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

  it('does a simple search and finds a result on the list', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Seattle, WA');

    cy.get('#facility-type-dropdown').select(
      facilityTypesOptions[LocationType.HEALTH],
    );
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').should('exist');
    cy.get('.facility-result a').should('exist');
  });
});
