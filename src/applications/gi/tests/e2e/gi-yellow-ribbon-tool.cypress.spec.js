import data from '../data/calculator-constants.json';
import yellowRibbonMock from '../data/yellow-ribbon-mock.json';

describe('GI Bill Comparison Tool - Yellow Ribbon Tool', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      statusCode: 200,
    });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'show_yellow_ribbon_table',
            value: true,
          },
        ],
      },
    }).as('featureToggles');
    cy.intercept('GET', '**/v1/gi/institutions/31800132*', {
      statusCode: 200,
      body: yellowRibbonMock,
    }).as('yellowRibbonProgram');
    cy.visit('education/gi-bill-comparison-tool/institution/31800132');
    cy.wait('@yellowRibbonProgram');
    cy.wait('@featureToggles');
  });
  it('clicks the "Jump to" link and navigates to the Yellow Ribbon Program section', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('a[href="#yellow-ribbon-program-information"]')
      .should('exist')
      .and('contain', 'Yellow Ribbon Program information')
      .first() // Ensure only the first link is clicked
      .click();

    cy.get('#yellow-ribbon-program-information')
      .should('exist')
      .and('be.visible');
  });
  it('should display the "Yellow Ribbon Program information" label and section', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('#yellow-ribbon-program-information').should('exist');
    cy.get('#yellow-ribbon-program-information')
      .contains('Yellow Ribbon Program information')
      .should('exist');
    cy.get('#yellow-ribbon-program-information').within(() => {
      cy.contains(
        'The Yellow Ribbon Program can help reduce your out-of-pocket tuition and fee costs',
      ).should('exist');
    });
  });
  it('should navigate when the Yellow Ribbon Program link is clicked', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('va-link[data-testid="yellow-ribbon-program-link"]')
      .shadow()
      .find('a')
      .click();
    cy.url().should(
      'include',
      '/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/',
    );
  });

  it('filters results when a user selects a degree level and clicks "Display Results"', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('va-select#degree')
      .shadow()
      .find('select')
      .select('Undergraduate');
    cy.get('va-button.degree-selector-btn')
      .shadow()
      .find('button')
      .click();
    cy.get('#results-summary')
      .should('exist')
      .and('contain', 'Undergraduate');
    cy.get('.degree-level-results li.degree-item').should('have.length', 1);
    cy.get('.degree-level-results li.degree-item').each(card => {
      cy.wrap(card).should('contain', 'College or professional school');
    });
  });
  it('filters results when a user selects a degree level and clicks "Display Results"', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('va-select#degree')
      .shadow()
      .find('select')
      .select('Doctoral');
    cy.get('va-button.degree-selector-btn')
      .shadow()
      .find('button')
      .click();
    cy.get('#results-summary')
      .should('exist')
      .and('contain', 'Doctoral');
    cy.get('.degree-level-results li.degree-item').should('have.length', 3);
    cy.get('.degree-level-results li.degree-item').each(card => {
      cy.wrap(card).should('contain', 'College or professional school');
    });
  });
  it('each program card for "Doctoral" shows correct text and numeric values', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('va-select#degree')
      .shadow()
      .find('select')
      .select('Doctoral');
    cy.get('va-button.degree-selector-btn')
      .shadow()
      .find('button')
      .click();
    cy.get('#results-summary')
      .should('exist')
      .and('contain', 'Doctoral');
    cy.get('.degree-level-results li.degree-item').should('have.length', 3);
    cy.get('.degree-level-results li.degree-item').each(card => {
      cy.wrap(card).within(() => {
        cy.get('p.vads-u-font-weight--bold')
          .first()
          .should('contain', 'College or professional school');
        cy.get('p')
          .eq(1)
          .invoke('text')
          .should('not.be.empty');
        cy.contains('Funding available').should('exist');
        cy.get('p')
          .contains(/\d+/)
          .should('exist');
        cy.contains('Max school contribution').should('exist');
        cy.get('p')
          .contains(/\$\d+(,\d{3})*(\.\d{2})?/)
          .should('exist');
      });
    });
  });
  it('filters results when a user selects a Doctoral degree level and clicks "Display Results"', () => {
    //   cy.injectAxeThenAxeCheck();
    cy.get('va-select#degree')
      .shadow()
      .find('select')
      .select('Doctoral');
    cy.get('va-button.degree-selector-btn')
      .shadow()
      .find('button')
      .click();
    cy.get('#results-summary')
      .should('exist')
      .and('contain', 'Showing 1-3 of 15 results for "Doctoral" degree level');
    cy.get('.degree-level-results li.degree-item').should('have.length', 3);
    cy.get('va-pagination').should('exist');
    cy.get('va-pagination')
      .shadow()
      .find('[aria-label="Next page"]')
      .click();
    cy.get('#results-summary').should(
      'contain',
      'Showing 4-6 of 15 results for "Doctoral" degree level',
    );
  });
});
