import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const site = new SecureMessagingSite();
    site.login(false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', '/health-care/secure-messaging');

    site.login();

    site.loadPage();
    cy.get('[data-testid="inbox-sidebar"] > a').click();

    cy.injectAxe();
    cy.axeCheck();
  });
});
