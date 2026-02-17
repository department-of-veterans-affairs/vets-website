export const SELECTORS = {
  APP: '[data-e2e-id="search-app"]',
  SEARCH_INPUT: '#search-field',
  SEARCH_BUTTON: '#search-field ~ button[type="submit"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULTS_EMPTY: '[data-e2e-id="search-results-empty"]',
  SEARCH_RESULTS_TITLE: '[data-e2e-id="result-title"]',
  SEARCH_RESULTS_COUNTER: '[data-e2e-id="results-counter"]',
  TOP_RECOMMENDATIONS: '[data-e2e-id="top-recommendations"]',
  TYPEAHEAD_DROPDOWN: '#va-search-listbox',
  TYPEAHEAD_OPTIONS: '#va-search-listbox li',
  ERROR_ALERT_BOX: '[data-e2e-id="alert-box"]',
  OUTAGE_BOX: 'va-banner',
  PAGINATION: 'va-pagination',
  HEADER_SEARCH_TRIGGER: 'button.sitewide-search-drop-down-panel-button',
  HEADER_SEARCH_FIELD: '.search-dropdown-input-field',
  HEADER_TYPEAHEAD_DROPDOWN: '[data-e2e-id="search-dropdown-options"]',
  HEADER_SEARCH_SUBMIT: '.search-dropdown-submit-button',
};

export const verifyRecommendationsLink = (text, href) => {
  cy.get(
    `${SELECTORS.TOP_RECOMMENDATIONS} ${SELECTORS.SEARCH_RESULTS_TITLE} va-link[text="${text}"]`,
  ).should('be.visible');
  cy.get(
    `${SELECTORS.TOP_RECOMMENDATIONS} ${SELECTORS.SEARCH_RESULTS_TITLE} va-link[href*="${href}"]`,
  ).should('be.visible');
};

export const verifyResultsLink = (text, href) => {
  cy.get(`${SELECTORS.SEARCH_RESULTS} li va-link[text="${text}"]`).should(
    'be.visible',
  );
  cy.get(`${SELECTORS.SEARCH_RESULTS} li va-link[href*="${href}"]`).should(
    'be.visible',
  );
};
