const baseUrl = Cypress.config('baseUrl');

describe('Confirmation Page', () => {
  const confirmationUrl = `${baseUrl}/discover-your-benefits/confirmation?benefits=GIB%2CFHV%2CSVC%2CVRE%2CVSC%2CDHS%2CVAP%2CMHC%2CFMP%2CVAL%2CDIS%2CCOE%2CVAH%2CBUR%2CBRG%2CSVB`;

  beforeEach(() => {
    cy.visit(confirmationUrl);
    cy.injectAxe();
  });

  it('renders the confirmation page with results and additional info', () => {
    cy.get('h2').should('contain', 'Your results');

    cy.get('va-additional-info')
      .should('be.visible')
      .and(
        'contain.text',
        `We can help guide you as you transition from active-duty service or`,
      );

    cy.axeCheck();
  });

  it('displays benefit cards', () => {
    cy.get('[data-testid^="benefit-card-"]').should(
      'have.length.greaterThan',
      0,
    );

    cy.axeCheck();
  });

  it('allows user to sort by category', () => {
    cy.get('va-select')
      .shadow()
      .find('select')
      .select('Type of benefit (A-Z)');

    cy.get('#filter-text').should('exist');

    cy.axeCheck();
  });

  it('applies and clears a filter', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Education')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('#filter-text').should('contain', 'results with 2 filters applied');

    cy.get('va-search-filter')
      .shadow()
      .find('button')
      .contains('Clear all filters')
      .click();

    cy.axeCheck();

    cy.get('#filter-text').should('contain', 'results with 1 filter applied');
  });

  it('applies and clears multiple filters', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Education')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Health care')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('#filter-text').should('contain', 'results with 3 filters applied');

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Clear all filters')
      .click();

    cy.axeCheck();

    cy.get('#filter-text').should('not.contain.text', 'filters applied');
  });

  it('navigates pagination if more than 10 results', () => {
    cy.get('va-pagination').should('be.visible');
    cy.get('va-pagination')
      .shadow()
      .find('[aria-label="Next page"]')
      .should('be.visible')
      .click();

    cy.axeCheck();

    cy.get('#filter-text').should(
      'contain.text',
      'Showing 11–15 of 15 results',
    );
  });

  it('filters benefits by "Before separation"', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Before separation')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('[data-testid^="benefit-card-"]')
      .first()
      .within(() => {
        cy.contains('h4', 'When to apply')
          .next('p')
          .should('contain.text', 'Before or after you separate from service');
      });

    cy.get('#filter-text').should('contain.text', '2 filters applied');
  });

  it('filters benefits by "After separation"', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'After separation')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('[data-testid^="benefit-card-"]')
      .first()
      .within(() => {
        cy.contains('h4', 'When to apply')
          .next('p')
          .should('contain.text', 'after you separate');
      });

    cy.get('#filter-text').should('contain.text', '2 filters applied');
  });

  it('shows all benefits when recommended filter is removed', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Show only results recommended for you')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('[data-testid^="benefit-card-"]').should(
      'have.length.greaterThan',
      0,
    );
    cy.get('#filter-text').should('not.contain.text', 'applied');
  });

  it('combines category and "When to Apply" filters correctly', () => {
    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Burials and memorials')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('va-checkbox')
      .shadow()
      .contains('label', 'Before separation')
      .click({ force: true });

    cy.get('va-search-filter', { includeShadowDom: true })
      .shadow()
      .find('button')
      .contains('Apply')
      .click();

    cy.axeCheck();

    cy.get('[data-testid^="benefit-card-"]')
      .first()
      .within(() => {
        cy.contains('h4', 'When to apply')
          .next('p')
          .should('contain.text', 'Before or after you separate');
      });

    cy.get('#filter-text').should(
      'contain.text',
      'results with 3 filters applied',
    );
  });
});
