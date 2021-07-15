import stub from '../../constants/stub.json';

const SELECTORS = {
  APP: '[data-e2e-id="search-app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULTS_EMPTY: '[data-e2e-id="search-results-empty"]',
  SEARCH_RESULTS_TITLE: '[data-e2e-id="result-title"]',
  ERROR_ALERT_BOX: '[data-e2e-id="alert-box"]',
};

for (let i = 0; i < 20; i += 1) {
  describe('Sitewide Search smoke test', () => {
    it('successfully searches and renders results from the global search', () => {
      cy.intercept('GET', '/v0/search?query=benefits', {
        body: stub,
        statusCode: 200,
      }).as('getSearchResultsGlobal');
      // navigate to page
      cy.visit('/search?query=benefits');
      cy.injectAxeThenAxeCheck();

      // Ensure App is present
      cy.get(SELECTORS.APP).should('exist');

      // Ensure form is present
      cy.get(SELECTORS.SEARCH_FORM).should('exist');

      // Await search results
      cy.wait('@getSearchResultsGlobal');

      // A11y check the search results.
      cy.axeCheck();

      // Check results to see if variety of nodes exist.
      cy.get(SELECTORS.SEARCH_RESULTS_TITLE)
        // Check title.
        .should('contain', 'Veterans Benefits Administration Home');

      cy.get(`${SELECTORS.SEARCH_RESULTS} li`)
        // Check url.
        .should('contain', 'https://benefits.va.gov/benefits/');
    });

    it('successfully searches and renders results from the results page', () => {
      cy.intercept('GET', '/v0/search?query=benefits&page=1', {
        body: stub,
        statusCode: 200,
      }).as('getSearchResultsPage');

      // navigate to page
      cy.visit('/search/?query=X');
      cy.injectAxeThenAxeCheck();

      // Ensure App is present
      cy.get(SELECTORS.APP).should('exist');

      // Ensure form is present
      cy.get(SELECTORS.SEARCH_FORM).should('exist');

      // Await search results

      cy.get(`${SELECTORS.SEARCH_FORM} input[name="query"]`).clear();
      cy.get(`${SELECTORS.SEARCH_FORM} input[name="query"]`).type('benefits');
      cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
      cy.wait('@getSearchResultsPage');

      // A11y check the search results.
      cy.axeCheck();

      // Check results to see if variety of nodes exist.
      cy.get(SELECTORS.SEARCH_RESULTS_TITLE)
        // Check title.
        .should('contain', 'Veterans Benefits Administration Home');

      cy.get(`${SELECTORS.SEARCH_RESULTS} li`)
        // Check url.
        .should('contain', 'https://benefits.va.gov/benefits/');
    });

    it('fails to search and has an error', () => {
      cy.intercept('GET', '/v0/search?query=benefits', {
        body: [],
        statusCode: 500,
      }).as('getSearchResultsFailed');
      // navigate to page
      cy.visit('/search/?query=benefits');
      cy.injectAxeThenAxeCheck();

      // Ensure App is present
      cy.get(SELECTORS.APP).should('exist');

      // Ensure form is present
      cy.get(SELECTORS.SEARCH_FORM).should('exist');

      // Fill out and submit the form.
      // cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
      cy.wait('@getSearchResultsFailed');

      // Ensure ERROR Alert Box exists
      cy.get(SELECTORS.ERROR_ALERT_BOX)
        // Check contain error message
        .should(
          'contain',
          "We’re sorry. Something went wrong on our end, and your search didn't go through. Please try again",
        );

      // A11y check the search results.
      cy.axeCheck();
    });
  });
}
