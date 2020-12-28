const axeTestPage = () => {
  cy.injectAxe();
  cy.axeCheck();
};

const mockFeatureToggles = () => {
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

const prepareSearch = term => {
  cy.visit('/');
  cy.get('button.sitewide-search-drop-down-panel-button').click();
  cy.get('#query').click();
  cy.get('#query').type(term);
};

const mockFetchSuggestions = () => {
  cy.route({
    method: 'GET',
    status: 200,
    url: 'https://search.usa.gov/sayt?=&name=va&q=benefits',
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
    url: 'https://search.usa.gov/sayt?=&name=va&q=health',
    response: [
      'health response 1',
      'health response 2',
      'health response 3',
      'health response 4',
      'health response 5',
    ],
  });
};

describe('Functionality of Site-wide Search', () => {
  it('appears when the dropdown is clicked', () => {
    cy.visit('/');
    cy.get('button.sitewide-search-drop-down-panel-button').click();
  });

  it('shows suggestions when user input is present and typeahead is enabled', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
  });

  it('should pass Axe requirements', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    axeTestPage();
  });

  it('Focusing the search button hides user input', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('#sitewide-search-submit-button').focus();
    cy.get('#suggestions-list').should('not.be.visible');
  });

  it('Focusing the input field repopulates suggestions', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('#sitewide-search-submit-button').focus();
    cy.get('#suggestions-list').should('not.be.visible');
    cy.get('#query').focus();
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
  });

  it('Clicking search button initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('#sitewide-search-submit-button').click();
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Clicking search button initiates search for input - typeahead enabled', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#sitewide-search-submit-button').click();
    cy.url().should('contain', '/search/?query=health');
  });

  it('Pressing enter initiates search for input - typeahead disabled', () => {
    mockFetchSuggestions();
    prepareSearch('benefits');
    cy.get('#query').type('{enter}');
    cy.url().should('contain', '/search/?query=benefits');
  });

  it('Pressing enter (focus on input field) initiates search for input - typeahead enabled', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#query').type('{enter}');
    cy.url().should('contain', '/search/?query=health');
  });

  it('Clicking a dropdown option initiates a search using the suggestion', () => {
    mockFeatureToggles();
    mockFetchSuggestions();
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);
    cy.get('[data-e2e-id="typeahead-option-3"]').click();
    cy.url().should('contain', '/search/?query=health%20response%203');
  });

  it('Pressing enter while a dropdown option is selected initiates a search using the suggestion', () => {
    mockFeatureToggles();
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
