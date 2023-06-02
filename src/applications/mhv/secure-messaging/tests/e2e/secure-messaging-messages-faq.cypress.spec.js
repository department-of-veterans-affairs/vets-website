import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Messages FAQ AXE check', () => {
  it.skip('Axe Check Messages FAQ', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get('[data-testid="messages-faq-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
