import stub from '../../constants/stub.json';

const SELECTORS = {
  APP: '[data-e2e-id="search-app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULTS_EMPTY: '[data-e2e-id="search-results-empty"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  ERROR_ALERT_BOX: '[data-e2e-id="alert-box"]',
};

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck();
}

describe('Sitewide Search smoke test', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('successfully searches and renders results', () => {
    cy.server();
    cy.route({
      method: 'GET',
      response: stub,
      status: 200,
      url: '/v0/search?query=benefits',
    }).as('getSearchResults');

    // navigate to page
    cy.visit('/search?query=benefits');
    axeTestPage();

    // Ensure App is present
    cy.get(SELECTORS.APP);

    // Ensure form is present
    cy.get(SELECTORS.SEARCH_FORM);

    // Fill out and submit the form.
    // cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
    cy.wait('@getSearchResults');

    // A11y check the search results.
    axeTestPage();

    // Check results to see if variety of nodes exist.
    cy.get(`${SELECTORS.SEARCH_RESULTS} li`)
      // Check results data.
      .should('contain', 'Veterans Benefits Administration Home')
      // Check location.
      .should('contain', 'https://benefits.va.gov/benefits/');
  });
});

it('fails to search and has an error', () => {
  cy.server();
  cy.route({
    method: 'GET',
    response: [],
    status: 500,
    url: '/v0/search?query=benefits',
  }).as('getSearchResults');

  // navigate to page
  cy.visit('/search/?query=benefits');
  axeTestPage();

  // Ensure App is present
  cy.get(SELECTORS.APP);

  // Ensure form is present
  cy.get(SELECTORS.SEARCH_FORM);

  // Fill out and submit the form.
  // cy.get(`${SELECTORS.SEARCH_FORM} button[type="submit"]`).click();
  cy.wait('@getSearchResults');

  // Ensure ERROR Alert Box exists
  cy.get(SELECTORS.SEARCH_RESULTS_EMPTY)
    // Check contain error message
    .should(
      'contain',
      'Sorry, no results found. Try again using different (or fewer) words.',
    );

  // A11y check the search results.
  axeTestPage();
});
