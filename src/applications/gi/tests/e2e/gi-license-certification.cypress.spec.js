import data from '../data/calculator-constants.json';
import lcListMockData from '../data/lc-list.json';
import lcDetailsMockData from '../data/lc-details.json';

describe('GI Bill Comparison Tool - License & Certification Pages', () => {
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
        features: [{ name: 'gi_comparison_tool_lce_toggle_flag', value: true }],
      },
    }).as('featureToggles');
  });

  describe('License & Certification Search Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearch');
      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    // TODO: displays error state when details fetch fails
    // TODO: displays typeahead suggestions filttered by category when user types in search box

    it('renders the search page header and description correctly', () => {
      cy.get('h1')
        .should('exist')
        .and('contain.text', 'Licenses, certifications, and prep courses');
      cy.get('p.lc-description')
        .first()
        .should('contain.text', 'Use the search tool to find out which tests');
    });

    it('displays error state when fetching results fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
      cy.wait('@lcError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });

  describe('License & Certification Search Results Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearch');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );
      cy.wait('@lcSearch');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    // TODO: updates results correctly when category checkboxes are changed
    // TODO: updates results correctly when state dropdown is changed
    // TODO: displays error state when details fetch fails

    // TODO: update test "displays search results with pagination"
    it('displays search results', () => {
      cy.get('h1').should('contain.text', 'Search results');
      cy.get('va-card').should('have.length', 10);
    });

    it('displays loading state while fetching results', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        delayMs: 2000,
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearchDelayed');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );
      cy.get('va-loading-indicator')
        .should('exist')
        .and('be.visible');
      cy.wait('@lcSearchDelayed');
      cy.get('va-loading-indicator').should('not.exist');
    });

    it('displays error state when fetching results fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      );
      cy.wait('@lcError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });

  describe('License & Certification Detail Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        statusCode: 200,
        body: lcDetailsMockData,
      }).as('lcDetails');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );
      cy.wait('@lcDetails');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('displays license/certification details correctly', () => {
      cy.get('h1').should('exist');
      cy.get('.lc-result-details')
        .should('exist')
        .within(() => {
          cy.get('h2').should('exist');
          cy.get('h3')
            .contains('Admin info')
            .should('be.visible');
          cy.get('h3')
            .contains('Test info')
            .should('be.visible');
        });
    });

    // TODO: does not display tests in a table if there is one test.
    // TODO: displays tests in a table if there are multiple tests.

    it('displays error state when details fetch fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs/3871@4494f', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcDetailsError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/3871@4494f/GENERAL%20ELECTRICIAN',
      );
      cy.wait('@lcDetailsError');

      cy.get('va-alert')
        .should('exist')
        .and('be.visible')
        .and(
          'contain.text',
          `We can't load the licenses and certifications details`,
        );
    });
  });
});
