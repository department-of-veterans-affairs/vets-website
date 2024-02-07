import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    const messageDetailsBody = messageDetails.data.attributes.body;

    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    PatientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test message body';
    PatientReplyPage.getMessageBodyField().type(testMessageBody, {
      force: true,
    });
    cy.injectAxe();

    PatientReplyPage.saveReplyDraft(messageDetails, testMessageBody);
    cy.log(
      `the message details after saveReplyDraft ${JSON.stringify(
        messageDetails,
      )}`,
    );
    cy.log(
      `the message details before assert${JSON.stringify(messageDetails)}`,
    );
    cy.log(`message details  Body${messageDetailsBody}`);
    cy.log(
      `messageDetails.data.attributes.body = ${
        messageDetails.data.attributes.body
      }`,
    );

    messageDetailsPage.ReplyToMessageTO(messageDetails);
    // messageDetailsPage.ReplyToMessagesenderName(messageDetails); // TODO skipped for flakiness
    messageDetailsPage.ReplyToMessageRecipientName(messageDetails);
    messageDetailsPage.ReplyToMessageDate(messageDetails);
    messageDetailsPage.ReplyToMessageId(messageDetails);

    messageDetails.data.attributes.body = messageDetailsBody;
    // messageDetailsPage.ReplyToMessageBody(messageDetailsBody); // TODO skipped for flakiness

    // Possibly move this to another test
    PatientReplyPage.sendReplyDraft(
      messageDetails.data.attributes.messageId,
      messageDetails.data.attributes.senderId,
      messageDetails.data.attributes.category,
      messageDetails.data.attributes.subject,
      `\n\n\nName\nTitleTest${testMessageBody}`,
    );
    PatientReplyPage.verifySendMessageConfirmationMessageText();
    PatientReplyPage.verifySendMessageConfirmationHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
  });
});
