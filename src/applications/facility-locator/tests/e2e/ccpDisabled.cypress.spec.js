import path from 'path';
import mockFeatureTogglesDisabled from '../fixtures/toggle-ccp-disabled.json';
import { LocationType } from '../../constants/index';
import { facilityTypesOptions } from '../../config';

describe('Facility Search - CCP (community care providers) disabled', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/feature_toggles*', mockFeatureTogglesDisabled);
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route('GET', '/v0/facilities/va?*', 'fx:constants/mock-facility-data');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
  });

  it('Does not render community care option in the dropdown, flag set to true', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-type-dropdown option').then(options => {
      const optionsWithoutCCP = [...options].map(o => o.text);
      expect(optionsWithoutCCP).to.not.include(
        facilityTypesOptions[LocationType.CC_PROVIDER],
      );
    });
  });
});
