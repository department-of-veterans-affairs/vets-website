// import stub from '../../constants/stub.json';

const SELECTORS = {
  APP: '[data-e2d-id="find-form-search-form"]',
  FINDFORM_INPUT: '[data-e2d-id="find-form-input"]',
  FINDFORM_SEARCH: '[data-e2d-id="find-form-search"]',
  FINDFORM_ERROR_BODY: '[data-e2d-id="find-form-error-body"]',
  FINDFORM_REQUIRED: '[data-e2d-id="find-form-required"]',
  FINDFORM_ERROR_MSG: '[data-e2d-id="find-form-error-message"]',
};

class FindFormComponent {
  loadFindFormComponent = query => {
    // Loads the forms page and checks existence
    if (query || query === ' ') cy.visit(`/find-form/?q=${query}`);
    else cy.visit(`/find-forms`);

    cy.get(SELECTORS.APP).should('exist');
  };

  inputTextAndSearch = str => {
    // Find input field, clear, and enter the string
    cy.get(SELECTORS.FINDFORM_INPUT)
      .should('exist')
      .should('not.be.disabled')
      .focus()
      .clear()
      .type(str, { force: true });

    // Click search button
    cy.get(SELECTORS.FINDFORM_SEARCH)
      .should('exist')
      .click();
  };

  isErrorDisplayed = () => {
    // Find the error body on the page
    cy.get(SELECTORS.FINDFORM_ERROR_BODY).should(
      'have.class',
      'usa-input-error',
    );

    // Find the error message on the page
    cy.get(SELECTORS.FINDFORM_ERROR_MSG)
      .should('exist')
      .should('have.class', 'usa-input-error');

    // Find the 'required' text for the error
    cy.get(SELECTORS.FINDFORM_REQUIRED)
      .should('exist')
      .should('contain', '(*Required)');

    // Find the input and check its border
    cy.get(SELECTORS.FINDFORM_INPUT)
      .should('have.css', 'border')
      .and('match', '3px solid #cd2026');
  };

  isErrorNotDisplayed = () => {
    cy.get(SELECTORS.FINDFORM_ERROR_BODY).should(
      'not.have.class',
      'usa-input-error',
    );

    cy.get(SELECTORS.FINDFORM_ERROR_MSG).should('not.exist');
    cy.get(SELECTORS.FINDFORM_REQUIRED).should('not.exist');
    cy.get(SELECTORS.FINDFORM_INPUT)
      .should('have.css', 'border')
      .and('not.match', '3px solid #cd2026');
  };
}

describe('Find a VA form smoke test', () => {
  beforeEach(function() {
    cy.server();
  });

  const findFormComponent = new FindFormComponent();

  it('does not display an error on initial page load with no URL query', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays an error if input is empty and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('');
    findFormComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays an error if input is size one and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('2');
    findFormComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does not display an error if input is greater than one character and search is clicked', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('health');
    findFormComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does not display an error on initial page load with an empty URL query', () => {
    findFormComponent.loadFindFormComponent(' ');
    findFormComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays an error on initial page load with a URL query of length one', () => {
    findFormComponent.loadFindFormComponent('2');
    findFormComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does not display an error on initial page load with a URL query of length greater than one', () => {
    findFormComponent.loadFindFormComponent('health');
    findFormComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('removes the error once a valid query has been entered into the input', () => {
    findFormComponent.loadFindFormComponent();
    findFormComponent.inputTextAndSearch('2');
    findFormComponent.isErrorDisplayed();

    findFormComponent.inputTextAndSearch('health');
    findFormComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });
});
