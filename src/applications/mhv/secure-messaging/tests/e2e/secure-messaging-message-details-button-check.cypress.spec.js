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
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    site.login();
    const messageDetails = landingPage.setMessageDateToYesterday(
      mockMessageDetails,
    );
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    landingPage.loadInboxMessages(inboxMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails, defaultMockThread);
    messageDetailsPage.verifyTrashButtonModal();
    messageDetailsPage.verifyMoveToButtonModal();
    messageDetailsPage.loadReplyPageDetails(messageDetails, defaultMockThread);
    patientInterstitialPage
      .getContinueButton()
      .click({ waitforanimations: true });
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    replyPage.getMessageBodyField().should('be.visible');
  });
});
