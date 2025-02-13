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

export const goToNextPage = () =>
  cy
    .get('va-pagination')
    .shadow()
    .findByText(/Next/i)
    .click();

export const typeSearchTerm = (term = '') =>
  cy
    .get(FINDFORM_INPUT_ROOT)
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
    .get(FINDFORM_INPUT_ROOT)
    .shadow()
    .find(FINDFORM_SEARCH)
    .should('exist')
    .and('be.visible')
    .click();

export const focusSearchButton = () =>
  cy
    .get(FINDFORM_INPUT_ROOT)
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
  cy.get(FINDFORM_REQUIRED)
    .should('exist')
    .should('contain', '(*Required)');
};
