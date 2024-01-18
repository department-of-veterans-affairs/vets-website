/**
 * [TestRail-integrated] Spec for Find a VA Form - required-fields.
 * @testrailinfo projectId 30
 * @testrailinfo suiteId 136
 * @testrailinfo groupId 3026
 * @testrailinfo runName FF-e2e-Required
 */
import chunk from 'lodash/chunk';
import { INITIAL_SORT_STATE, FAF_SORT_OPTIONS } from '../../constants';
import { sortTheResults } from '../../helpers';
import stub from '../../constants/stub.json';

const SELECTORS = {
  WIDGET: '[data-widget-type="find-va-forms"]',
  INPUT_ROOT: 'va-search-input',
  SEARCH_FORM: '[data-e2e-id="find-form-search-form"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  NEXT_PAGE: '.usa-pagination__list > li[aria-label="Next page"] > a',
  SORT_SELECT_WIDGET: 'va-select[name="findFormsSortBySelect"]',
};

describe('functionality of Find Forms', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'find_forms_show_pdf_modal',
            value: true,
          },
        ],
      },
    });
    cy.intercept('GET', '/v0/forms?query=health', stub).as('getFindAForm');
  });

  it('search the form and expect dom to have elements - C3994', () => {
    // navigate to find-forms and make axe check on browser
    cy.visit('/find-forms/');

    // Ensure form is present
    cy.get(SELECTORS.SEARCH_FORM);

    // Search the form
    cy.get(SELECTORS.INPUT_ROOT)
      .shadow()
      .find('input')
      .scrollIntoView()
      .clear()
      .focus()
      .type('health', { force: true })
      .should('not.be.disabled');

    cy.get(SELECTORS.INPUT_ROOT)
      .shadow()
      .find('button')
      .should('exist')
      .click();

    cy.wait('@getFindAForm');

    // Ensure at least 1 title is present
    cy.get(`${SELECTORS.SEARCH_RESULT_TITLE}`).should('exist');

    cy.injectAxe();
    cy.axeCheck();

    // iterate through all pages and ensure each form download link is present on each form result.
    const validForms = stub.data
      .filter(form => form.attributes.validPdf)
      .sort((a, b) => sortTheResults(INITIAL_SORT_STATE, a, b));

    const pageLength = 10;
    const pages = chunk(validForms, pageLength);

    pages.forEach((page, pageNumber) => {
      page.forEach(form => {
        cy.get(`a[data-testid="pdf-link-${form.id}"]`).should('exist');
      });

      const nextPage = pageNumber + 1;
      const hasNextPage = nextPage < pages.length;

      if (hasNextPage) {
        cy.get(SELECTORS.NEXT_PAGE)
          .click()
          .then(() => cy.axeCheck());
      }
    });

    // Ensure Sort Widget exists
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET}`);
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET}`)
      .shadow()
      .get(`option`)
      // Finds both the shadow DOM option and the React Fiber option, so have to multiply 'expected' by 2
      .should('have.length', FAF_SORT_OPTIONS.length * 2);
    cy.get(`${SELECTORS.SORT_SELECT_WIDGET}`)
      .shadow()
      .get(`option:first`)
      .should('be.selected')
      .should('contain', FAF_SORT_OPTIONS[0]);
  });

  it('opens PDF modal - C12431', () => {
    cy.visit('/find-forms/?q=health');
    cy.get('a[data-testid^="pdf-link"]').then($links => {
      const randomIndex = Math.floor(Math.random() * $links.length);
      cy.wrap($links)
        .eq(randomIndex)
        .scrollIntoView()
        .click({ force: true });
    });
    cy.get('va-modal', { timeout: 25000 })
      .shadow()
      .get('.va-modal-title')
      .should('contain.text', 'PDF');

    cy.injectAxe();
    cy.axeCheck();
  });
});
