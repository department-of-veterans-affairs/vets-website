import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Keyboard Nav To Compose', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    site.loadPage();
  });
  it('Keyboard Nav from Welcome Page to Compose', () => {
    cy.tabToElement('[data-testid="compose-message-link"]');
    cy.realPress(['Enter']);
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"] ');
  });
});
