import mockFeatureTogglesEnabled from '../fixtures/toggle-ccp-enabled.json';
import mockFacilityData from '../../constants/mock-facility-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

const CC_PROVIDER = 'Community providers (in VA’s network)';

describe('Facility Search - CCP (community care providers) enabled', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', mockFacilityData);
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('Does render community care option in the dropdown by default, flag does not exist', () => {
    cy.intercept('GET', '/v0/feature_toggles*', []);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select(CC_PROVIDER);
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .should('exist');
    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.include(CC_PROVIDER);
    });
  });

  it('Does render community care option in the dropdown when flat set to false', () => {
    cy.intercept('GET', '/v0/feature_toggles*', [mockFeatureTogglesEnabled]);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .select(CC_PROVIDER);
    cy.get('#facility-type-dropdown')
      .shadow()
      .find('select')
      .should('exist');
    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.include(CC_PROVIDER);
    });
  });
});
