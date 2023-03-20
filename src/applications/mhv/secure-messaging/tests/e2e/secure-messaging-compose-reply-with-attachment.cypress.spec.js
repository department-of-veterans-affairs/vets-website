import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';

describe('Compose REPLY message With Attacments and Errors', () => {
  it('compose message with attachment', () => {
    const landingPage = new PatientInboxPage();
    // const messageDetailsPage = new PatientMessageDetailsPage();
    // const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const testMessage = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, testMessage);

    cy.injectAxe();
    cy.axeCheck();
  });
});
