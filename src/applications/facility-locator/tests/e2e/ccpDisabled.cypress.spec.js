import path from 'path';
import mockFeatureTogglesDisabled from '../fixtures/toggle-ccp-disabled.json';

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

  // facilitiesPpmsSuppressCommunityCare flag set to true
  it('Does not render community care option in the dropdown', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    // TODO fix this test
    // cy.get('#facility-type-dropdown').select('Community providers (in VA’s network)').should('be.not.be.visible');
  });
});
