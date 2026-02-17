export const APP = '[data-e2e-id="find-form-search-form"]';
export const WIDGET = '[data-widget-type="find-va-forms"]';
export const FINDFORM_INPUT_ROOT = 'va-search-input';
export const FINDFORM_INPUT = 'input';
export const FINDFORM_SEARCH = 'button[type="submit"]';
export const FINDFORM_ERROR_BODY = '[data-e2e-id="find-form-error-body"]';
export const FINDFORM_REQUIRED = '[data-e2e-id="find-form-required"]';
export const FINDFORM_ERROR_MSG = '[data-e2e-id="find-form-error-message"]';
export const SEARCH_RESULT_TITLE = '[data-e2e-id="result-title"]';
export const SORT_SELECT_WIDGET = 'va-select[name="findFormsSortBySelect"]';
export const ADOBE_LINK = '[data-e2e-id="adobe-link"]';
export const MODAL_DOWNLOAD_LINK = '[data-e2e-id="modal-download-link"]';
export const MODAL_CLOSE_BUTTON = '.va-modal-close';
export const MODAL = 'va-modal';
export const FORM_DETAIL_HEADER = '[data-testid="va_form--downloadable-pdf"]';
export const NO_RESULTS = '[data-e2e-id="ff-no-results"]';
export const NO_RESULTS_DD214 = '[data-e2e-id="ff-no-results-dd214"]';

export const goToNextPage = () =>
  cy.get('va-pagination').shadow().findByText(/Next/i).click();

export const goToPrevPage = () =>
  cy
    .get('va-pagination')
    .shadow()
    .findByText(/Previous/i)
    .click();

export const typeSearchTerm = (term = '') =>
  cy
    .get(FINDFORM_INPUT_ROOT, { timeout: 10000 })
    .shadow()
    .find(FINDFORM_INPUT)
    .should('exist')
    .and('be.visible')
    .scrollIntoView()
    .focus()
    .clear()
    .type(term, { force: true });

export const clickSearch = () =>
  cy
    .get(FINDFORM_INPUT_ROOT, { timeout: 10000 })
    .shadow()
    .find(FINDFORM_SEARCH)
    .should('exist')
    .and('be.visible')
    .click();

export const focusSearchButton = () =>
  cy
    .get(FINDFORM_INPUT_ROOT, { timeout: 10000 })
    .shadow()
    .find(FINDFORM_SEARCH)
    .should('exist')
    .and('be.visible')
    .focus();

export const confirmNoErrors = () => {
  cy.get(FINDFORM_ERROR_BODY).should('not.exist');
  cy.get(FINDFORM_ERROR_MSG).should('not.exist');
  cy.get(FINDFORM_REQUIRED).should('not.exist');
};

export const confirmErrorsDisplayed = () => {
  // Find the error body on the page
  cy.get(APP).should('have.class', 'usa-input-error');

  // Find the error message on the page
  cy.get(FINDFORM_ERROR_MSG)
    .should('exist')
    .should('have.class', 'usa-input-error-message');

  // Find the 'required' text for the error
  cy.get(FINDFORM_REQUIRED).should('exist').should('contain', '(*Required)');
};

export const validateSearchResult = (
  formNumber,
  formName,
  revisionDate,
  relatedTo,
  index,
  hasDetailPage,
  formToolText = null,
) => {
  cy.get('li').eq(index).scrollIntoView();

  if (hasDetailPage) {
    cy.get(`h3[aria-describedby="${formNumber}"] va-link`)
      .shadow()
      .find('a')
      .should('exist')
      .and('be.visible')
      .and('have.text', formName);
  } else {
    cy.get(`h3[aria-describedby="${formNumber}"]`)
      .should('exist')
      .and('be.visible')
      .and('have.text', formName);
  }

  cy.get('[data-e2e-id="form-revision-date"]')
    .eq(index)
    .should('exist')
    .and('be.visible')
    .and('have.text', `Form revision date: ${revisionDate}`);

  cy.get('[data-e2e-id="related-to"]')
    .eq(index)
    .should('exist')
    .and('be.visible')
    .and('have.text', `Related to: ${relatedTo}`);

  cy.get('.va-button-link')
    .eq(index)
    .should('exist')
    .and('be.visible')
    .and('have.text', `Download VA Form ${formNumber} (PDF)`);

  if (formToolText) {
    cy.get(`va-link-action[text="${formToolText}"]`)
      .shadow()
      .find('a')
      .should('exist')
      .and('be.visible');
  }
};

export const verifyElementExists = selector =>
  cy.get(selector).should('exist').and('be.visible');

export const verifyElementShouldContainText = (selector, text) =>
  cy.get(selector).should('exist').and('be.visible').and('contain.text', text);

export const verifyTextInsideLink = (selector, text) =>
  cy
    .get(selector)
    .eq(0)
    .shadow()
    .find('a')
    .should('exist')
    .and('have.text', text);

export const verifyElementDoesNotExist = selector =>
  cy.get(selector).should('not.exist');

export const waitForPageToLoad = () => {
  // Wait for the main app container to be present
  cy.get(APP, { timeout: 15000 }).should('exist');

  // Wait for the search input to be present and ready
  cy.get(FINDFORM_INPUT_ROOT, { timeout: 15000 })
    .should('exist')
    .and('be.visible');

  // Wait for the shadow DOM to be ready
  cy.get(FINDFORM_INPUT_ROOT)
    .shadow()
    .find(FINDFORM_INPUT, { timeout: 10000 })
    .should('exist')
    .and('be.visible');
};
