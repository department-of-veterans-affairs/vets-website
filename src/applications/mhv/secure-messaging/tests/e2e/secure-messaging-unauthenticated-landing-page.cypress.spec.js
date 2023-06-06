import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login(false);
    SecureMessagingSite.loadPageUnauthenticated();

    cy.url().should('contain', '/health-care/secure-messaging');

    SecureMessagingSite.login();

    PatientInboxPage.loadInboxMessages();
    cy.get('[data-testid="inbox-sidebar"] > a').click();

    cy.injectAxe();
    cy.axeCheck();
  });
});
