import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const draftsPage = new PatientMessageDraftsPage();
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    const messageDetailsBody = messageDetails.data.attributes.body;

    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    patientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test message body';
    replyPage.getMessageBodyField().type(testMessageBody, { force: true });
    cy.realPress(['Enter']).then(() => {
      replyPage.saveReplyDraft(messageDetails, `${testMessageBody}\n`);
      cy.log(
        `the message details after saveReplyDraft ${JSON.stringify(
          messageDetails,
        )}`,
      );
    });

    messageDetailsPage.ReplyToMessageTO(messageDetails);
    messageDetailsPage.ReplyToMessagesenderName(messageDetails);
    messageDetailsPage.ReplyToMessagerecipientName(messageDetails);
    messageDetailsPage.ReplyToMessageDate(messageDetails);
    messageDetailsPage.ReplyToMessageId(messageDetails);

    messageDetails.data.attributes.body = messageDetailsBody;
    messageDetailsPage.ReplyToMessageBody(messageDetailsBody);
    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteReplyDraftWithEnterKey(messageDetails);
    landingPage.verifyDeleteConfirmMessage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
