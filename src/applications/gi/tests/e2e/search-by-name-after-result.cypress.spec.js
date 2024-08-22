import data from '../data/calculator-constants.json';

describe('go bill CT Rearch By Name After Result', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
  });
  it('should show reslut when user types School, employer, or training provider in the search input and hits Search button', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="ct-input"]').type('Texas');
    cy.get('[data-testid="search-btn"]').click();
    cy.get('[id="name-search-results-count"]').as('searchResults');
    cy.get('@searchResults').should('be.focused');
    cy.get('@searchResults').should(
      'contain',
      'Showing 183 search results for "Texas"',
    );
  });
});
