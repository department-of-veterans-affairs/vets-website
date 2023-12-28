import mockRepresentativeData from '../../constants/mock-representative-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import { generateFeatureToggles } from '../../mocks/feature-toggles';

Cypress.Commands.add('checkSearch', () => {
  cy.get('input[name="City, state, postal code or address"]', {
    timeout: 5000,
  }).type(`Austin, TX`, { force: true });

  cy.get('#representative-search').click();

  // Result list
  cy.get('.representative-search-results-container').should('exist');
});

describe('Mobile', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'find_a_representative', value: true }],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/veteran/v0/vso_accredited_representatives',
      mockRepresentativeData,
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('should render in mobile layouts', () => {
    cy.visit('/get-help-from-accredited-representative/find-rep/');
    generateFeatureToggles();
    cy.injectAxe();
    cy.axeCheck();

    // iPhone X
    cy.viewport(400, 812);
    cy.checkSearch();

    // iPhone 6/7/8 plus
    cy.viewport(414, 736);
    cy.checkSearch();

    // Pixel 2
    cy.viewport(411, 731);
    cy.checkSearch();

    // Galaxy S5/Moto
    cy.viewport(360, 640);
    cy.checkSearch();
  });
});
