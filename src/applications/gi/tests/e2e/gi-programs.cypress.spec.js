import data from '../data/calculator-constants.json';

describe('GI Bill Comparison Tool - Programs List', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'toggleGiProgramsFlag',
            value: true,
          },
        ],
      },
    }).as('featureToggles');
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {
      statusCode: 200,
    });
    cy.visit(
      'education/gi-bill-comparison-tool/institution/318Z0032/institution-of-higher-learning',
    );
    cy.wait('@featureToggles');
    // cy.get('[data-testid="program-link"]').should('exist');
    // cy.get('[data-testid="program-link"]')
    //   .first()
    //   .click();
  });

  it('should show a "no results" message when an invalid program name is searched', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('SomeRandomProgramName');
    cy.contains('button', 'Search').click();
    cy.get('#no-results-message')
      .should('be.visible')
      .and('contain', 'We didn’t find any results for');
  });

  it('should clear the search query and display all programs when "Reset search" is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('ACCOUNTING');
    cy.contains('button', 'Search').click();
    cy.contains('button', 'Reset search').click();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .should('have.value', '')
      .should('be.focused');
    cy.get('[data-testid="program-list-item"]').should('have.length', 20);
  });

  it('should display relevant results when a user searches for "ACCOUNTING"', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('ACCOUNTING');
    cy.contains('button', 'Search').click();
    cy.get('#results-summary').should('contain', 'ACCOUNTING');
    cy.get('[data-testid="program-list-item"]').should('have.length', 4);
    cy.get('[data-testid="program-list-item"]')
      .first()
      .should('contain', 'ACCOUNTING-CPA TRACK-BS');
  });

  it('displays an error if the user tries to search with an empty input', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type(' ');
    cy.contains('button', 'Search').click();
    cy.get('[class="usa-error-message"]')
      .should(
        'contain',
        'Please fill in a program name and then select search.',
      )
      .should('exist');
  });

  it('paginates correctly when there are more than 20 programs', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-pagination').should('exist');
    cy.get('#results-summary').should('contain', 'Showing 1-20');
    cy.get('va-pagination')
      .shadow()
      .find('[aria-label="Next page"]')
      .click();
    cy.get('#results-summary').should('contain', 'Showing 21-');
  });
});
