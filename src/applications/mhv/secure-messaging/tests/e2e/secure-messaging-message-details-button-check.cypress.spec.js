import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientReplyPage from './pages/PatientReplyPage';

describe('Secure Messaging Message Details Buttons Check', () => {
  it('Message Details Buttons Check', () => {
    const replyPage = new PatientReplyPage();
    SecureMessagingSite.login();
    const messageDetails = PatientInboxPage.setMessageDateToYesterday(
      mockMessageDetails,
    );
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    PatientInboxPage.loadInboxMessages(inboxMessages, messageDetails);
    PatientMessageDetailsPage.loadMessageDetails(
      messageDetails,
      defaultMockThread,
    );
    PatientMessageDetailsPage.verifyTrashButtonModal();
    PatientMessageDetailsPage.verifyMoveToButtonModal();
    PatientMessageDetailsPage.loadReplyPageDetails(
      messageDetails,
      defaultMockThread,
    );
    PatientInterstitialPage.getContinueButton().click({
      waitforanimations: true,
    });
    cy.injectAxe();
    cy.axeCheck();
    replyPage.getMessageBodyField().should('be.visible');
  });
});
