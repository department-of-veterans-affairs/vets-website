import data from '../data/calculator-constants.json';

describe('go bill CT Rearch By Name After Result', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
    cy.get('[data-testid="ct-input"]').type('Texas');
    cy.get('[data-testid="search-btn"]').click();
  });
  it('should show reslut when user types School, employer, or training provider in the search input and hits Search button', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[id="name-search-results-count"]').as('searchResults');
    cy.get('@searchResults').should('be.focused');
    cy.get('@searchResults').should(
      'contain',
      'Showing 183 search results for "Texas"',
    );
  });
  it('should show Update Tuition accordion not expanded and when user click on it, it should expanded', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'button[id="update-tuition,-housing,-and-monthly-benefit-estimates-accordion-button"]',
    ).as('updateTuition');
    cy.get('@updateTuition').should('not.have.attr', 'aria-expanded', 'true');
  });
});
