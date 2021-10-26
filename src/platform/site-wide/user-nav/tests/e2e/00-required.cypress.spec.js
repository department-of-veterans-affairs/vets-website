const axeTestPage = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const enableTypeahead = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: '/v0/feature_toggles*',
    response: {
      data: {
        features: [
          {
            name: 'search_typeahead_enabled',
            value: true,
          },
        ],
      },
    },
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

const prepareSearch = term => {
  cy.visit('/');
  cy.get('button.sitewide-search-drop-down-panel-button').click();
  cy.get('#query').click();
  cy.get('#query')
    .should('exist')
    .should('not.be.disabled')
    .type(term, { force: true });
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

describe('Site-wide Search general functionality', () => {
  beforeEach(function() {
    cy.server();
  });

  // default cases
  it('appears when the dropdown is clicked', () => {
    cy.visit('/');
    cy.get('button.sitewide-search-drop-down-panel-button').click();
  });

  it('should pass Axe requirements', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    axeTestPage();
  });
});

describe('Site-wide Search functionality with typeahead disabled', () => {
  beforeEach(function() {
    cy.server();
  });

  it('Clicking search button initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('[data-e2e-id="sitewide-search-submit-button"]').click();
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Pressing enter initiates search for input - typeahead disabled', () => {
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#query').type('{enter}');
    cy.url().should('contain', '/search/?query=benefits');
  });
});

describe('Site-wide Search functionality with typeahead enabled', () => {
  beforeEach(function() {
    cy.server();
  });

  it('shows suggestions when user input is present and typeahead is enabled - C5371', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
  });

  it('Focusing the search button hides user input - C5372', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="sitewide-search-submit-button"]').focus();
    cy.get('#suggestions-list').should('not.exist');
  });

  it('Focusing the input field repopulates suggestions - C5373', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="sitewide-search-submit-button"]').focus();
    cy.get('#suggestions-list').should('not.exist');
    cy.get('#query').focus();
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
  });

  it('Clicking search button initiates search for input - typeahead enabled - C5374', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('[data-e2e-id="sitewide-search-submit-button"]').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on input field) initiates search for input - typeahead enabled - C5375', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#query').type('{enter}');
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on search button) initiates search for input - typeahead enabled - C5376', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('[data-e2e-id="sitewide-search-submit-button"]')
      .focus()
      .type('{enter}');
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Pressing space (focus on search button) initiates search for input - typeahead enabled - C5377', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('[data-e2e-id="sitewide-search-submit-button"]')
      .focus()
      .type(' ');
    cy.url().should('contain', '/search/?query=health');
  });

  it('Clicking a dropdown option initiates a search using the suggestion - C5378', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="typeahead-option-3"]').click();
    cy.url().should('contain', '/search/?query=health%20response%203');
  });

  it('Can use the arrow keys to navigate suggestions, and press enter to search using them - C5379', () => {
    enableTypeahead();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('#query')
      .type('{downarrow}')
      .type('{downarrow}')
      .type('{downarrow}')
      .type('{enter}');
    cy.url().should('contain', '/search/?query=benefits%20response%203');
  });
});

describe('Site-wide Search functionality with search dropdown component enabled', () => {
  beforeEach(function() {
    cy.server();
  });

  it('shows suggestions when user input is present and typeahead is enabled - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
      .children()
      .should('have.length', 5);
  });

  it('Focusing the search button hides user input - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').focus();
    cy.get('#search-dropdown-component-listbox').should('not.exist');
  });

  it('Focusing the input field repopulates suggestions - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').focus();
    cy.get('#search-dropdown-component-listbox').should('not.exist');
    cy.get('#search-header-dropdown-input-field').focus();
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
      .children()
      .should('have.length', 5);
  });

  it('Clicking search button initiates search for input - typeahead enabled - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on input field) initiates search for input - typeahead enabled - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-header-dropdown-input-field').type('{enter}');
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter (focus on search button) initiates search for input - typeahead enabled - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Pressing space (focus on search button) initiates search for input - typeahead enabled - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('[data-e2e-id="search-header-dropdown-submit-button"]').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Clicking a dropdown option initiates a search using the suggestion - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('health');
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
      .children()
      .should('have.length', 5);
    cy.get('#search-dropdown-component-option-3').click();
    cy.url().should('contain', '/search/?query=health%20response%204');
  });

  it('Can use the arrow keys to navigate suggestions, and press enter to search using them - ####', () => {
    enableDropdownComponent();
    mockFetchSuggestions();
    prepareDropdownSearch('benefits');
    cy.get('#search-dropdown-component-listbox').should('be.visible');
    cy.get('#search-dropdown-component-listbox')
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
