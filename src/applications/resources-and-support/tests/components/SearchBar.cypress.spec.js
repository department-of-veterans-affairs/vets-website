const SELECTORS = {
  APP: '[data-e2e-id="resources-support-search-form"]',
  RS_INPUT: '[data-e2e-id="resources-support-input"]',
  RS_SEARCH: '[data-e2e-id="resources-support-"]',
  RS_RESOURCE_RADIO: '[data-e2e-id="resources-support-resource-radio"]',
  RS_ALL_VA_RADIO: '[data-e2e-id="resources-support-resource-all-va-radio"]',
  RS_ERROR_BODY: '[data-e2e-id="resources-support-error-body"]',
  RS_REQUIRED: '[data-e2e-id="resources-support-required"]',
  RS_ERROR_MESSAGE: '[data-e2e-id="resources-support-error-message"]',
};

class ResourceSupportSearchBarComponent {
  loadResourceSupportStandalonePage = () => {
    cy.visit('/resources');
    cy.get(SELECTORS.APP).should('exist');
  };

  loadResourceSupportSearchPage = query => {
    cy.visit(`/resources/search/?q=${query}`);
  };

  inputText = str => {
    // Find input field, clear, and enter the string
    if (str) {
      cy.get(SELECTORS.RS_INPUT)
        .should('exist')
        .should('not.be.disabled')
        .focus()
        .clear()
        .type(str, { force: true });
    }
  };

  focusSearch = () => {
    cy.get(SELECTORS.RS_SEARCH)
      .should('exist')
      .focus();
  };

  clickSearch = () => {
    // Click search button
    cy.get(SELECTORS.RS_SEARCH)
      .should('exist')
      .click();
  };

  inputTextAndSearch = str => {
    // Find input field, clear, and enter the string
    this.inputText(str);

    // Click search button
    this.clickSearch();
  };

  clickResourcesRadioButton = () => {
    cy.get(SELECTORS.RS_RESOURCE_RADIO).click();
  };

  clickAllVaRadioButton = () => {
    cy.get(SELECTORS.RS_ALL_VA_RADIO).click();
  };

  isErrorDisplayed = () => {
    // Find the error body on the page
    cy.get(SELECTORS.RS_ERROR_BODY).should('have.class', 'usa-input-error');

    // Find the error message on the page
    cy.get(SELECTORS.RS_ERROR_MESSAGE)
      .should('exist')
      .should('have.class', 'usa-input-error-message');

    // Find the 'required' text for the error
    cy.get(SELECTORS.RS_REQUIRED)
      .should('exist')
      .should('contain', '(*Required)');
  };

  isErrorNotDisplayed = () => {
    cy.get(SELECTORS.RS_ERROR_BODY).should('not.have.class', 'usa-input-error');

    cy.get(SELECTORS.RS_ERROR_MESSAGE).should('not.exist');
    cy.get(SELECTORS.RS_REQUIRED).should('not.exist');
  };
}

describe('Resources and Support Search Bar smoke test', () => {
  beforeEach(() => {
    cy.server();
  });

  const resourceSupportSearchComponent = new ResourceSupportSearchBarComponent();

  it('does not display an error on initial page load', () => {
    resourceSupportSearchComponent.loadResourceSupportStandalonePage();
    resourceSupportSearchComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does not display an error on initial page load with a URL query', () => {
    resourceSupportSearchComponent.loadResourceSupportSearchPage('health');
    resourceSupportSearchComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does display an error when resources and support search is clicked with no text input', () => {
    resourceSupportSearchComponent.loadResourceSupportStandalonePage();
    resourceSupportSearchComponent.clickResourcesRadioButton();
    resourceSupportSearchComponent.inputTextAndSearch('');
    resourceSupportSearchComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('does display an error when all VA.gov search is clicked with no text input', () => {
    resourceSupportSearchComponent.loadResourceSupportStandalonePage();
    resourceSupportSearchComponent.clickAllVaRadioButton();
    resourceSupportSearchComponent.inputTextAndSearch('');
    resourceSupportSearchComponent.isErrorDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('removes the error once text has been input', () => {
    resourceSupportSearchComponent.loadResourceSupportStandalonePage();
    resourceSupportSearchComponent.inputTextAndSearch('');
    resourceSupportSearchComponent.isErrorDisplayed();
    resourceSupportSearchComponent.inputText('health');
    resourceSupportSearchComponent.isErrorNotDisplayed();

    cy.injectAxe();
    cy.axeCheck();
  });
});
