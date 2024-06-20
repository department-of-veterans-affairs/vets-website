// Selectors for elements in find-forms
const SELECTORS = {
  APP: '[data-e2e-id="find-form-search-form"]',
  FINDFORM_INPUT_ROOT: 'va-search-input',
  FINDFORM_INPUT: 'input',
  FINDFORM_SEARCH: 'button',
  FINDFORM_ERROR_BODY: '[data-e2e-id="find-form-error-body"]',
  FINDFORM_REQUIRED: '[data-e2e-id="find-form-required"]',
  FINDFORM_ERROR_MSG: '[data-e2e-id="find-form-error-message"]',
};

// Page object class - Tests are below
class FindFormComponent {
  loadFindFormComponent = query => {
    // Loads the forms page and checks existence
    if (query || query === ' ') cy.visit(`/find-forms/?q=${query}`);
    else cy.visit(`/find-forms/`);
    cy.injectAxe();
    cy.get(SELECTORS.APP).should('exist');
  };

  inputText = str => {
    // Find input field, clear, and enter the string
    if (str) {
      cy.get(SELECTORS.FINDFORM_INPUT_ROOT)
        .shadow()
        .find(SELECTORS.FINDFORM_INPUT)
        .as('formInput');
      cy.get('@formInput').scrollIntoView();
      cy.get('@formInput').focus();
      cy.get('@formInput').clear();
      cy.get('@formInput').should('not.be.disabled');
      cy.get('@formInput').type(str, { force: true });
    }
  };

  focusSearch = () => {
    cy.get(SELECTORS.FINDFORM_INPUT_ROOT)
      .shadow()
      .find(SELECTORS.FINDFORM_SEARCH)
      .as('formSearch');
    cy.get('@formSearch').focus();
    cy.get('@formSearch').should('exist');
  };

  clickSearch = () => {
    // Click search button
    cy.get(SELECTORS.FINDFORM_INPUT_ROOT)
      .shadow()
      .find(SELECTORS.FINDFORM_SEARCH)
      .as('formSearch');
    cy.get('@formSearch').click();
    cy.get('@formSearch').should('exist');
  };

  inputTextAndSearch = str => {
    this.inputText(str);
    this.clickSearch();
  };

  isErrorDisplayed = () => {
    // Find the error body on the page
    cy.get(SELECTORS.APP).should('have.class', 'usa-input-error');

    // Find the error message on the page
    cy.get(SELECTORS.FINDFORM_ERROR_MSG)
      .should('exist')
      .should('have.class', 'usa-input-error-message');

    // Find the 'required' text for the error
    cy.get(SELECTORS.FINDFORM_REQUIRED)
      .should('exist')
      .should('contain', '(*Required)');
  };

  isErrorNotDisplayed = () => {
    cy.get(SELECTORS.FINDFORM_ERROR_BODY).should('not.exist');
    cy.get(SELECTORS.FINDFORM_ERROR_MSG).should('not.exist');
    cy.get(SELECTORS.FINDFORM_REQUIRED).should('not.exist');
  };
}

// Tests for find-forms application
describe('Find a VA form smoke test', () => {
  const findFormComponent = new FindFormComponent();

  it('does not display an error on initial page load with no URL query', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('displays an error if input is empty and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('');
    findFormComponent.isErrorDisplayed();

    cy.axeCheck();
  });

  it('displays an error if input is size one and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('h');
    findFormComponent.isErrorDisplayed();

    cy.axeCheck();
  });

  it('does not display an error if input is greater than one character and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('health');
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('does not display an error on initial page load with an empty URL query', () => {
    findFormComponent.loadFindFormComponent(' ');
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('displays an error on initial page load with a URL query of length one', () => {
    findFormComponent.loadFindFormComponent('h');
    findFormComponent.isErrorDisplayed();

    cy.axeCheck();
  });

  it('does not display an error on initial page load with a URL query of length greater than one', () => {
    findFormComponent.loadFindFormComponent('health');
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('removes the error once a valid query has been entered into the input', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('h');
    findFormComponent.isErrorDisplayed();

    findFormComponent.inputTextAndSearch('health');
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('does not display an error when the query is valid and text is removed', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('health');
    findFormComponent.isErrorNotDisplayed();
    findFormComponent.inputText('h');
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });

  it('does not display an error when the query is invalid and the input loses focus', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputText('h');
    findFormComponent.focusSearch();
    findFormComponent.isErrorNotDisplayed();

    cy.axeCheck();
  });
});
