import data from '../data/calculator-constants.json';

describe('go bill CT before search', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
  });
  it('show Comparison Tool title', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'h1[class="vads-u-text-align--center small-screen:vads-u-text-align--left"',
    ).should('contain', 'GI Bill® Comparison Tool');
  });
});
