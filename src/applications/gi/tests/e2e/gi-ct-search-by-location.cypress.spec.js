import data from '../data/calculator-constants.json';

describe('go bill CT before search by location', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
    cy.get('button[data-testid="Search-by-location"]').click();
  });
  it('should go to search by location when location Tab is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('label[id="institution-search-label"]').should(
      'contain',
      'City, state, or postal code',
    );
  });
  it('should show error if search input is empty and search button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="location-search-button"]').click();
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a city, state, or postal code.',
    );
  });
});
