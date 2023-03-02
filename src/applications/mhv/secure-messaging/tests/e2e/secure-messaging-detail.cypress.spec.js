import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import messageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();

    landingPage.loadInboxMessages(inboxMessages, messageDetails);
    landingPage.loadPage();
    detailsPage.loadMessageDetails(
      landingPage.getInboxTestMessageDetails(),
      defaultMockThread,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
