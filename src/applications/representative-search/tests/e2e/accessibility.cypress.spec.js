import mockRepresentativeData from '../../constants/mock-representative-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import { generateFeatureToggles } from '../../mocks/feature-toggles';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.viewport(1200, 700);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'find_a_representative', value: true }],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/veteran/v0/accredited_representatives',
      mockRepresentativeData,
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('traverses form controls via keyboard input', () => {
    cy.visit('/get-help-from-accredited-representative/find-rep/');
    generateFeatureToggles();

    cy.injectAxe();
    cy.axeCheck();

    // Verify focused on input location
    cy.get('#representative-search-controls').trigger('mousedown');
    cy.tab();
    cy.get('input[name="City, state, postal code or address"]').focused();
    // Tab
    cy.get('input[name="City, state, postal code or address"]').focus();
    cy.get('input[name="City, state, postal code or address"]').trigger(
      'keydown',
      {
        keyCode: 9,
        which: 9,
      },
    );

    // Verify focused radio button
    cy.get('va-radio').trigger('keydown', {
      keyCode: 9,
      which: 9,
    });

    cy.get('va-accordion').focused();
    cy.get('va-accordion').trigger('keydown', {
      keyCode: 9,
      which: 9,
    });

    // Verify focused on rep/org input
    cy.get('input[name="Officer or Accredited Representative Name"]').focused();
    cy.get('input[name="Officer or Accredited Representative Name"]').trigger(
      'keydown',
      {
        keyCode: 9,
        which: 9,
      },
    );

    // Verify focused on Search button
    cy.get('button[id="representative-search"]').focused();
  });
});
