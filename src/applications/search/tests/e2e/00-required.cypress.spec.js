import stub from '../../constants/stub.json';

const SELECTORS = {
  APP: '[data-e2e-id="search-app"]',
  SEARCH_INPUT: '[data-e2e-id="search-results-page-dropdown-input-field"]',
  SEARCH_BUTTON: '[data-e2e-id="search-results-page-dropdown-submit-button"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULTS_EMPTY: '[data-e2e-id="search-results-empty"]',
  SEARCH_RESULTS_TITLE: '[data-e2e-id="result-title"]',
  ERROR_ALERT_BOX: '[data-e2e-id="alert-box"]',
};

const enableDropdownComponent = () => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        {
          name: 'search_dropdown_component_enabled',
          value: true,
        },
      ],
    },
  });
};

describe('Sitewide Search smoke test', () => {
  it('successfully searches and renders results from the global search', () => {
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: stub,
      statusCode: 200,
    }).as('getSearchResultsGlobal');
    // navigate to page
    cy.visit('/search?query=benefits');
    cy.injectAxeThenAxeCheck();

    // Ensure App is present
    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');

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
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=*', {
      body: stub,
      statusCode: 200,
    }).as('getSearchResultsPage');

    // navigate to page
    cy.visit('/search/?query=');
    cy.injectAxeThenAxeCheck();

    // Ensure App is present
    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_INPUT}`).focus();
    cy.get(`${SELECTORS.SEARCH_INPUT}`).clear();
    cy.get(`${SELECTORS.SEARCH_INPUT}`).type('benefits');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).click();

    // Await search results
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
    enableDropdownComponent();
    cy.intercept('GET', '/v0/search?query=benefits', {
      body: [],
      statusCode: 500,
    }).as('getSearchResultsFailed');
    // navigate to page
    cy.visit('/search/?query=benefits');
    cy.injectAxeThenAxeCheck();

    // Ensure App is present
    cy.get(SELECTORS.APP).should('exist');

    cy.get(`${SELECTORS.SEARCH_INPUT}`).should('exist');
    cy.get(`${SELECTORS.SEARCH_BUTTON}`).should('exist');

    // Fill out and submit the form.
    cy.wait('@getSearchResultsFailed');

    // Ensure ERROR Alert Box exists
    cy.get(SELECTORS.ERROR_ALERT_BOX)
      // Check contain error message
      .should('contain', `Your search didn't go through`);

    // A11y check the search results.
    cy.axeCheck();
  });
});
