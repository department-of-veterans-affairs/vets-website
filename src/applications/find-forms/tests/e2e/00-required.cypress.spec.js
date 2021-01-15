// Dependencies.
import chunk from 'lodash/chunk';

// Relative Imports
import { deriveLatestIssue } from '../../components/SearchResult';

const stub = require('../../constants/stub.json');

const SELECTORS = {
  WIDGET: '[data-widget-type="find-va-forms"]',
  SEARCH_FORM: '[data-e2e-id="find-form-search-form"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  NEXT_PAGE: '.va-pagination-next > a',
};

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck();
}

const sortTheResults = (indexA, indexB) => {
  const sortOptions = ['Last Updated (Newest)', 'Last Updated (Oldest)'];
  const [LAST_UPDATED_NEWEST_OPTION, LAST_UPDATED_OLDEST_OPTION] = sortOptions;
  const howToSort = sortOptions[0];
  const latestTimeStampIndexA = deriveLatestIssue(
    indexA.attributes.firstIssuedOn,
    indexA.attributes.lastRevisionOn,
  );

  const latestTimeStampIndexB = deriveLatestIssue(
    indexB.attributes.firstIssuedOn,
    indexB.attributes.lastRevisionOn,
  );

  const newestDate = deriveLatestIssue(
    latestTimeStampIndexA,
    latestTimeStampIndexB,
  );

  const oldestDate =
    latestTimeStampIndexA === newestDate
      ? latestTimeStampIndexB
      : latestTimeStampIndexA;

  if (howToSort === LAST_UPDATED_NEWEST_OPTION) {
    if (newestDate === latestTimeStampIndexA) return -1;
    else if (newestDate === latestTimeStampIndexB) return 1;
  }

  if (howToSort === LAST_UPDATED_OLDEST_OPTION) {
    if (oldestDate === latestTimeStampIndexA) return -1;
    else if (oldestDate === latestTimeStampIndexB) return 1;
  }

  return 0;
};

describe('functionality of Find Forms', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('search the form and expect dom to have elements', () => {
    cy.server();
    cy.route({
      method: 'GET',
      response: stub,
      status: 200,
      url: '/v0/forms?query=health',
    }).as('getFindAForm');

    // navigate to find-forms and make axe check on browser
    cy.visit('/find-forms/');
    axeTestPage();

    // Ensure form is present
    cy.get(SELECTORS.SEARCH_FORM);

    // Search the form
    cy.get('input#va-form-query').type('health');
    cy.get(`${SELECTORS.SEARCH_FORM} .usa-button`).click();
    cy.wait('@getFindAForm');

    // Ensure at least 1 title is present
    cy.get(`${SELECTORS.SEARCH_RESULT_TITLE}`);

    // iterate through all pages and ensure each form download link is present on each form result.
    const validForms = stub.data
      .filter(form => form.attributes.validPdf)
      .sort((a, b) => sortTheResults(a, b));
    const pageLength = 10;
    const pages = chunk(validForms, pageLength);

    pages.forEach((page, pageNumber) => {
      page.forEach(form => {
        cy.get(`a[href="${form.attributes.url}"]`);
      });

      const nextPage = pageNumber + 1;
      const hasNextPage = nextPage < pages.length;

      if (hasNextPage) {
        cy.get(SELECTORS.NEXT_PAGE)
          .click()
          .then(() => axeTestPage());
      }
    });
  });
});
