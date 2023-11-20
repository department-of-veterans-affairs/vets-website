import mockRepresentativeData from '../../constants/mock-representative-data.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

Cypress.Commands.add('checkSearch', () => {
  cy.axeCheck();

  // Search
  cy.get('input[name="City, State or Postal code"]', { timeout: 5000 })
    .should('exist')
    .should('not.be.disabled')
    .clear({ force: true });

  cy.get('#street-city-state-zip')
    .find('input[type="text"]')
    .type('Austin, TX');
  cy.get('#representative-search').click();

  // Result list
  cy.get('.representative-results-list').should('exist');
});

describe('Mobile', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept(
      'GET',
      '/services/veteran/v0/accredited_representatives',
      mockRepresentativeData,
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('should render in mobile layouts', () => {
    cy.visit('/get-help-from-accredited-representative/find-rep/');
    cy.axeCheck();
    cy.injectAxe();

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
