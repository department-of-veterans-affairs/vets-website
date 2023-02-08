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
      .select('Inbox')
      .should('contain', 'Inbox');
    cy.injectAxe();
    cy.axeCheck();
  });
});
