// Dependencies.
import chunk from 'lodash/chunk';

// Relative Imports
import { INITIAL_SORT_STATE, SORT_OPTIONS } from '../../constants';
import { sortTheResults } from '../../helpers';
import stub from '../../constants/stub.json';

const SELECTORS = {
  WIDGET: '[data-widget-type="find-va-forms"]',
  SEARCH_FORM: '[data-e2e-id="find-form-search-form"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  NEXT_PAGE: '.va-pagination-next > a',
  SORT_SELECT_WIDGET: 'select.find-forms-search--sort-select',
};

function axeTestPage() {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
}

describe('functionality of Find Forms', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('search the form and expect dom to have elements', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'find_forms_mvp_enhancement',
            value: true,
          },
        ],
      },
    });
    cy.intercept('GET', '/v0/forms?query=HEALTH', stub).as('getFindAForm');

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
      .sort((a, b) => sortTheResults(INITIAL_SORT_STATE, a, b));

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

    // Ensure Sort Widget exists
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET}`);
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET} option`).should(
      'have.length',
      SORT_OPTIONS.length,
    );
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET} option:first`)
      .should('be.selected')
      .should('contain', SORT_OPTIONS[0]);
  });
});
