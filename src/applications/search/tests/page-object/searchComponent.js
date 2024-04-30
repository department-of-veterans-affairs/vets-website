/**
 * This uses the page object to enhance the writing of Cypress E2E tests by modularizing the code snippets
 */

class SearchComponent {
  /** Loads this component for testing by setting up the page and entering a search term */
  loadComponent = term => {
    this.enableDropdownComponent();
    this.mockFetchSuggestions();
    this.prepareDropdownSearch(term);
  };

  /** Enables the dropdown component on the page */
  enableDropdownComponent = () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: 'search_dropdown_component_enabled',
            value: true,
          },
        ],
      },
    });
  };

  /** Visits the va.gov page, clicks the Search field, and enters the search term */
  prepareDropdownSearch = term => {
    cy.visit('/');
    cy.get('button.sitewide-search-drop-down-panel-button').click();
    cy.get('.search-dropdown-input-field').click();
    cy.get('.search-dropdown-input-field')
      .should('exist')
      .should('not.be.disabled')
      .type(term, { force: true });
  };

  /** Mocks the query typeahead suggestions */
  mockFetchSuggestions = () => {
    cy.intercept('GET', 'v0/search_typeahead?query=benefits', [
      'benefits response 1',
      'benefits response 2',
      'benefits response 3',
      'benefits response 4',
      'benefits response 5',
    ]);

    cy.intercept('GET', 'v0/search_typeahead?query=health', [
      'health response 1',
      'health response 2',
      'health response 3',
      'health response 4',
      'health response 5',
    ]);
  };

  /** Opens the dropdown and checks its length is 5 */
  confirmDropDown = () => {
    cy.get('.search-dropdown-options').should('be.visible');
    cy.get('.search-dropdown-options')
      .children()
      .should('have.length', 5);
  };

  /** Gets the input field dropdown, moves down three items, and presses Enter */
  navigateSearchSuggestions = () => {
    cy.get('.search-dropdown-input-field').type('{downarrow}');
    cy.get('.search-dropdown-input-field').type('{downarrow}');
    cy.get('.search-dropdown-input-field').type('{downarrow}');
    cy.get('.search-dropdown-input-field').type('{enter}');
  };

  /** Focuses on the Search button and checks that the listbox disappears */
  confirmSearchFocusHidesInput = () => {
    cy.get('button[type="submit"]').focus();
    cy.get('#va-search-listbox').should('not.exist');
  };

  /** Presses enter in the Search input field */
  clickEnterInInputField = () => {
    cy.get('.search-dropdown-input-field').type('{enter}');
  };

  /** Click the Search submit button */
  clickSubmitButton = () => {
    cy.get('button[type="submit"]').click();
  };

  /** Focuses on the Search input field */
  focusOnInputField = () => {
    cy.get('.search-dropdown-input-field').focus();
  };

  /** Focuses on the Search submit button */
  focusOnSubmitButton = () => {
    cy.get('button[type="submit"]').focus();
  };

  /** Checks the current URL for the queryString */
  checkIfUrlContains = queryString => {
    cy.url().should('contain', queryString);
  };

  /** Clicks on the third item in the Search dropdown list */
  clickTypeAheadItem = () => {
    cy.get(`#search-header-dropdown-option-3`).click();
  };
}

export default SearchComponent;
