const axeTestPage = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const prepareDropdownSearch = term => {
  cy.visit('/');
  cy.get('button.sitewide-search-drop-down-panel-button').click();
  cy.get('#search-header-dropdown-input-field').click();
  cy.get('#search-header-dropdown-input-field')
    .should('exist')
    .should('not.be.disabled')
    .type(term, { force: true });
};

const mockFetchSuggestions = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: 'v0/search_typeahead?query=benefits',
    response: [
      'benefits response 1',
      'benefits response 2',
      'benefits response 3',
      'benefits response 4',
      'benefits response 5',
    ],
  });
  cy.route({
    method: 'GET',
    status: 200,
    url: 'v0/search_typeahead?query=health',
    response: [
      'health response 1',
      'health response 2',
      'health response 3',
      'health response 4',
      'health response 5',
    ],
  });
};

const enableDropdownComponent = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: '/v0/feature_toggles*',
    response: {
      data: {
        features: [
          {
            name: 'search_dropdown_component_enabled',
            value: true,
          },
        ],
      },
    },
  });
};

describe('Site-wide Search functionality with search dropdown component enabled', () => {
  beforeEach(function() {
    cy.server();
  });

  it('passes axe requirements - - C12121', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
    axeTestPage();
  });

  it('shows suggestions when user input is present and typeahead is enabled - - C12122', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
  });

  it('Focusing the search button hides user input - - C12123', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').focus();
    cy.get('#search-header-dropdown-listbox').should('not.exist');
  });

  it('Focusing the input field repopulates suggestions - - C12124', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').focus();
    cy.get('#search-header-dropdown-listbox').should('not.exist');
    cy.get('#search-header-dropdown-input-field').focus();
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
  });

  it('Clicking search button initiates search for input - C12125', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on input field) initiates search for input - C12126', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-header-dropdown-input-field').type('{enter}');
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on search button) initiates search for input - C12127', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Pressing space (focus on search button) initiates search for input - C12128', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Clicking a dropdown option initiates a search using the suggestion - C12129', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
    cy.get('#search-header-dropdown-option-3').click();
    cy.url().should('contain', '/search/?query=health%20response%204');
  });

  it('Can use the arrow keys to navigate suggestions, and press enter to search using them - C12130', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-header-dropdown-listbox').should('be.visible');
    cy.get('#search-header-dropdown-listbox')
      .children()
      .should('have.length', 5);
    cy.get('#search-header-dropdown-input-field')
      .type('{downarrow}')
      .type('{downarrow}')
      .type('{downarrow}')
      .type('{enter}');
    cy.url().should('contain', '/search/?query=benefits%20response%203');
  });
});
