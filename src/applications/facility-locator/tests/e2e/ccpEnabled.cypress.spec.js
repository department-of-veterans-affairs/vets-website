import path from 'path';
import mockFeatureTogglesEnabled from '../fixtures/toggle-ccp-enabled.json';
import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';

describe('Facility Search - CCP (community care providers) enabled', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route('GET', '/v0/facilities/va?*', 'fx:constants/mock-facility-data');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
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
