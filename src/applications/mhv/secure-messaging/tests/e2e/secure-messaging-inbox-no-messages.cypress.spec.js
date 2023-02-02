import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Inbox No Messages', () => {
  it('inbox no messages', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadEmptyPage(false);
    cy.get('[data-testid=alert-no-messages] p')
      .should('have.text', 'There are no messages in this folder.')
      .should('be.visible');
    cy.injectAxe();
    cy.axeCheck();
  });
});
