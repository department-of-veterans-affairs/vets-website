import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
