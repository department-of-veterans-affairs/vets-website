import SecureMessagingSite from './sm_site/SecureMessagingSite';
// import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';

import PatientInboxPage from './pages/PatientInboxPage';
// import PatientReplyPage from './pages/PatientReplyPage';

describe('Compose message With Attacments and Errors', () => {
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
