import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const site = new SecureMessagingSite();
    site.login(false);
    site.loadPageUnauthenticated();

    cy.get('body').should('contain', 'health-care/secure-messaging');
  });
});
