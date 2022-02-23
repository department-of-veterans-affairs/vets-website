const prepareSearch = term => {
  cy.visit('/');
  cy.get('button.sitewide-search-drop-down-panel-button').click();
  cy.get('#query').click();
  cy.get('#query')
    .should('exist')
    .should('not.be.disabled')
    .type(term, { force: true });
};

describe('Site-wide Search general functionality', () => {
  beforeEach(() => {
    cy.server();
  });

  // default cases
  it('appears when the dropdown is clicked', () => {
    cy.visit('/');
    cy.get('button.sitewide-search-drop-down-panel-button').click();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('should pass Axe requirements', () => {
    prepareSearch('health');
    cy.get('#suggestions-list').should('be.visible');
    cy.get('#suggestions-list')
      .children()
      .should('have.length', 5);

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('Site-wide Search functionality with typeahead disabled', () => {
  beforeEach(() => {
    cy.server();
  });

  it('Clicking search button initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('[data-e2e-id="sitewide-search-submit-button"]').click();
    cy.url().should('contain', '/search/?query=benefits');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Pressing enter initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('#query').type('{enter}');
    cy.url().should('contain', '/search/?query=benefits');

    cy.injectAxe();
    cy.axeCheck();
  });
});
