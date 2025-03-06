import data from '../data/calculator-constants.json';
import programsListMockdata from '../data/programs-lisk-mock-data.json';

describe('GI Bill Comparison Tool - Programs List', () => {
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
            name: 'gi_comparison_tool_programs_toggle_flag',
            value: true,
          },
        ],
      },
    }).as('featureToggles');
    cy.intercept('GET', '**/v0/gi/institution_programs/search*', {
      statusCode: 200,
      body: programsListMockdata,
    }).as('institutionPrograms');
    cy.visit(
      'education/gi-bill-comparison-tool/institution/31800132/non-college-degree',
    );
    cy.wait('@institutionPrograms');
    cy.wait('@featureToggles');
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
  it('should display relevant results when a user searches for "ALTERNATIVE"', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#search-input')
      .shadow()
      .find('input')
      .type('ALTERNATIVE');
    cy.contains('button', 'Search').click();
    cy.get('#results-summary').should('contain', 'ALTERNATIVE');
    cy.get('[data-testid="program-list-item"]').should('have.length', 11);
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
