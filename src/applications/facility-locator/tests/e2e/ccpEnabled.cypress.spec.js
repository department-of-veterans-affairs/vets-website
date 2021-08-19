import mockFeatureTogglesEnabled from '../fixtures/toggle-ccp-enabled.json';
import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';
import mockFacilityData from '../../constants/mock-facility-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

describe('Facility Search - CCP (community care providers) enabled', () => {
  beforeEach(() => {
    cy.server();
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/v1/facilities/va?*', mockFacilityData);
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('Does render community care option in the dropdown by default, flag does not exist', () => {
    cy.route('GET', '/v0/feature_toggles*', []);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .select(facilityTypesOptions[LocationType.CC_PROVIDER])
      .should('exist');
    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.include(
        facilityTypesOptions[LocationType.CC_PROVIDER],
      );
    });
  });

  it('Does render community care option in the dropdown when flat set to false', () => {
    cy.route('GET', '/v0/feature_toggles*', [mockFeatureTogglesEnabled]);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .select(facilityTypesOptions[LocationType.CC_PROVIDER])
      .should('exist');
    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.include(
        facilityTypesOptions[LocationType.CC_PROVIDER],
      );
    });
  });
});
