import mockFeatureTogglesDisabled from '../fixtures/toggle-ccp-disabled.json';
import mockFacilityData from '../../constants/mock-facility-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

const CC_PROVIDER = 'Community providers (in VA’s network)';

describe('Facility Search - CCP (community care providers) disabled', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureTogglesDisabled);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', mockFacilityData);
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('Does not render community care option in the dropdown, flag set to true', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.not.include(CC_PROVIDER);
    });
  });
});
