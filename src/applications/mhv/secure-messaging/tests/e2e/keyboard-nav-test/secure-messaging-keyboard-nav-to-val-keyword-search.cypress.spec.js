import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging validate keyboard search Form Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    site.loadPage();
  });
  it('validate keyboard search', () => {
    cy.get('#select-search-folder-dropdown')
      .shadow()
      .find('select')
      .select(2);
    cy.get('[data-testid="search-keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('inbox');
    cy.get('.search-button > .fas').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
