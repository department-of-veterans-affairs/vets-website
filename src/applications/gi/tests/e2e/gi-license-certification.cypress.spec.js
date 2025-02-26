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
      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('renders the search page header and description correctly', () => {
      cy.get('h1')
        .should('exist')
        .and('contain.text', 'Licenses, certifications, and prep courses');
      cy.get('p')
        .first()
        .should('contain.text', 'Use the search tool to find out which tests');
    });
  });

  describe('License & Certification Search Results Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearch');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results?name=security',
      );
      cy.wait('@lcSearch');
      cy.wait('@featureToggles');
      cy.injectAxeThenAxeCheck();
    });

    it('displays search results with pagination', () => {
      cy.get('h1').should('contain.text', 'Search results');
      cy.get('#results-summary').should('contain', 'Showing 1-10');
      cy.get('va-card').should('have.length', 10);

      // Test pagination
      cy.get('va-pagination')
        .shadow()
        .find('[aria-label="Next page"]')
        .click();
      cy.get('#results-summary').should('not.contain', 'Showing 1-10');
    });

    it('displays loading state while fetching results', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        delayMs: 2000,
        statusCode: 200,
        body: lcListMockData,
      }).as('lcSearchDelayed');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses?name=security',
      );
      cy.get('va-loading-indicator')
        .should('exist')
        .and('be.visible');
      cy.wait('@lcSearchDelayed');
      cy.get('va-loading-indicator').should('not.exist');
    });

    it('handles filter updates correctly', () => {
      cy.get('.filter-your-results')
        .should('exist')
        .within(() => {
          cy.get('input[type="checkbox"]')
            .first()
            .check();
          cy.contains('Update Search').click();
        });
      cy.wait('@lcSearch');
    });
  });

  describe('License & Certification Detail Page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs*', {
        statusCode: 200,
        body: lcDetailsMockData,
      }).as('lcDetails');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/1@sec*',
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
          cy.contains('Admin Info').should('be.visible');
          cy.contains('Test Info').should('be.visible');
        });
    });

    it('displays error state when details fetch fails', () => {
      cy.intercept('GET', '**/v1/gi/lcpe/lacs', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('lcDetailsError');

      cy.visit(
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/1@sec*',
      );
      cy.wait('@lcDetailsError');

      cy.get('va-alert[data-e2e-id="alert-box"]')
        .should('exist')
        .and('be.visible')
        .and('contain.text', `We can't load the details right now`);
    });
  });
});
