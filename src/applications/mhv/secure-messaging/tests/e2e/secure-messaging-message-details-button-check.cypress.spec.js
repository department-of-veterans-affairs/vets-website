import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';

describe('Secure Messaging Message Details Buttons Check', () => {
  it('Message Details Buttons Check', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const messageDetailsPage = new PatientMessageDetailsPage();
    site.login();
    const messageDetails = landingPage.setMessageDateToYesterday(
      mockMessageDetails,
    );
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    landingPage.loadInboxMessages(inboxMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails, defaultMockThread);
    messageDetailsPage.verifyTrashButtonModal();
    messageDetailsPage.verifyMoveToButtonModal();
    messageDetailsPage.verifyReplyButtonAction();
    cy.injectAxe();
    cy.axeCheck();
  });
});
