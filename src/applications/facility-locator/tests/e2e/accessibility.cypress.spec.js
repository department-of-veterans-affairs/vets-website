import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';
import mockFacilityData from '../../constants/mock-facility-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.viewport(1200, 700);
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/v0/facilities/va?*', mockFacilityData);
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('traverses form controls via keyboard input', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    // Verify Use My Location is first in tab order
    cy.get('#facility-search-controls').trigger('mousedown');
    cy.tab();
    cy.get('button.use-my-location-link').focused();
    cy.tab();

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
