const prepareSearch = term => {
  cy.visit('/');
  cy.get('button.sitewide-search-drop-down-panel-button').click();
  cy.get('.search-dropdown-input-field').click();
  cy.get('.search-dropdown-input-field')
    .should('exist')
    .should('not.be.disabled')
    .type(term, { force: true });
};

describe('Site-wide Search general functionality', () => {
  // default cases
  it('appears when the dropdown is clicked', () => {
    cy.visit('/');
    cy.get('button.sitewide-search-drop-down-panel-button').click();

    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('Site-wide Search functionality with typeahead disabled', () => {
  it('Clicking search button initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('.search-dropdown-submit-button').click();
    cy.url().should('contain', '/search/?query=benefits');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Pressing enter initiates search for input - typeahead disabled', () => {
    prepareSearch('benefits');
    cy.get('.search-dropdown-input-field').type('{enter}');
    cy.url().should('contain', '/search/?query=benefits');

    cy.injectAxe();
    cy.axeCheck();
  });
});
