import mockRepresentativeData from '../../constants/mock-representative-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.viewport(1200, 700);
    cy.intercept('GET', '/v0/feature_toggles?*', []);
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

    cy.injectAxe();
    cy.axeCheck();

    // Verify Use My Location is first in tab order
    cy.get('#representative-search-controls').trigger('mousedown');
    cy.tab();
    cy.get('button.use-my-location-button').focused();
    cy.tab();

    // Verify focused on input location
    cy.get('input[name="City, State or Postal code"]').focused();
    // Tab
    cy.get('input[name="City, State or Postal code"]').focus();
    cy.get('input[name="City, State or Postal code"]').trigger('keydown', {
      keyCode: 9,
      which: 9,
    });

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
    cy.get('input[name="Organization or Representative Name"]').focused();
    cy.get('input[name="Organization or Representative Name"]').trigger(
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
