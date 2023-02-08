import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Messages FAQ AXE check', () => {
  it.skip('Axe Check Messages FAQ', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    cy.get('[data-testid="messages-faq-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
