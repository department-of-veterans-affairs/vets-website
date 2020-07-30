import path from 'path';
import mockFeatureTogglesEnabled from '../fixtures/toggle-ccp-enabled.json';

describe('Facility Search - CCP (community care providers) disabled', () => {
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

  // Flag non existent
  it('Does render community care option in the dropdown by default', () => {
    cy.route('GET', '/v0/feature_toggles*', []);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .select('Community providers (in VA’s network)')
      .should('exist');
  });

  // facilitiesPpmsSuppressCommunityCare flag set to fa;se
  it('Does render community care option in the dropdown by default', () => {
    cy.route('GET', '/v0/feature_toggles*', [mockFeatureTogglesEnabled]);
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();
    cy.get('#facility-type-dropdown')
      .select('Community providers (in VA’s network)')
      .should('exist');
  });
});
