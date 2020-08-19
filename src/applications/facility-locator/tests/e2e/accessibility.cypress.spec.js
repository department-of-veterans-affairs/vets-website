import path from 'path';
import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';

describe('Accessibility', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.viewport(1200, 700);
    cy.server();
    cy.route('GET', '/v0/feature_toggles?*', []);
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route('GET', '/v0/facilities/va?*', 'fx:constants/mock-facility-data');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
  });

  it('traverses form controls via keyboard input', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    // Start by long click and tab to access input location
    cy.get('#facility-search-controls').trigger('mousedown');
    cy.tab();
    cy.get('#facility-search-controls').trigger('mouseleave');

    // Verify focused on input location
    cy.get('#street-city-state-zip').focused();
    // Tab
    cy.get('#street-city-state-zip').tab();
    // Verify focused on facility dropdown
    cy.get('#facility-type-dropdown').focused();

    // Select facility option
    cy.get('#facility-type-dropdown').select(
      facilityTypesOptions[LocationType.HEALTH],
    );

    // Tab
    cy.get('#facility-type-dropdown').tab();
    // Verify focused on service dropdown
    cy.get('#service-type-dropdown').focused();
    // Tab
    cy.get('#facility-type-dropdown').tab();
    cy.get('#facility-search').focused();
  });
});
