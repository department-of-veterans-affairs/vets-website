import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const testMessage = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, testMessage);

    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    patientInterstitialPage
      .getContinueButton()
      .click({ waitforanimations: true });
    replyPage.getMessageBodyField().type('Test message body', { force: true });
    cy.injectAxe();
    cy.axeCheck('.secure-messaging-container', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    replyPage.sendReplyMessageDetails(testMessage);
    replyPage.verifySendMessageConfirmationMessage();
  });
});
