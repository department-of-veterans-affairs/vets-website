import mockRepresentativeData from '../../constants/mock-representative-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import { generateFeatureToggles } from '../../mocks/feature-toggles';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.viewport(1200, 700);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'find_a_representative_enable_frontend', value: true },
        ],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/veteran/v0/other_accredited_representatives',
      mockRepresentativeData,
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('traverses form controls via keyboard input', () => {
    cy.visit('/get-help-from-accredited-representative/find-rep/');
    generateFeatureToggles();

    cy.injectAxeThenAxeCheck();

    cy.get('va-radio[label="Type of accredited representative"]')
      .find('va-radio-option')
      .first()
      .click();

    cy.realPress('Tab');

    cy.get('va-link#accredited-representative-faqs-link')
      .find('a')
      .should('be.focused');

    cy.realPress('Tab');

    cy.get('va-text-input#street-city-state-zip')
      .find('button')
      .should('be.focused');

    cy.realPress('Tab');

    cy.get('va-text-input#street-city-state-zip')
      .find('input')
      .should('be.focused');

    cy.realPress('Tab');

    cy.get('va-select[label="Search area"]')
      .find('select')
      .should('be.focused');

    cy.realPress('Tab');

    cy.get('va-text-input[name="Name of accredited representative"]')
      .find('input')
      .should('be.focused');

    cy.realPress('Tab');

    cy.get('va-button[text="Search"]')
      .find('button')
      .should('be.focused');
  });
});
