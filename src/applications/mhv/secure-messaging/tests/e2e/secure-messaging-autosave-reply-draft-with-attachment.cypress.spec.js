import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';
import PatientComposePage from './pages/PatientComposePage';

describe('autosave Reply draft with attachment', () => {
  it(' Autosave Reply Draft', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    const composePage = new PatientComposePage();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    patientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test message body';
    replyPage.getMessageBodyField().type(testMessageBody, { force: true });
    cy.injectAxe();
    cy.axeCheck();
    composePage.attachMessageFromFile('test_image.gif');
    replyPage.autosaveReplyDraft(messageDetails, testMessageBody);
    cy.contains('Your message was saved');
  });
});
