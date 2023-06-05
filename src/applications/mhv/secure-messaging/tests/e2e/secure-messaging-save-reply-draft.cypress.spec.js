import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    SecureMessagingSite.login();
    const messageDetails = PatientInboxPage.getNewMessageDetails();
    const messageDetailsBody = messageDetails.data.attributes.body;

    PatientInboxPage.loadInboxMessages(mockMessages, messageDetails);
    PatientMessageDetailsPage.loadMessageDetails(messageDetails);
    PatientMessageDetailsPage.loadReplyPageDetails(messageDetails);
    PatientInterstitialPage.getContinueButton().click();
    const testMessageBody = 'Test message body';
    PatientReplyPage.getMessageBodyField().type(testMessageBody, {
      force: true,
    });
    cy.injectAxe();
    cy.axeCheck();

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
    PatientMessageDetailsPage.ReplyToMessageTO(messageDetails);
    PatientMessageDetailsPage.ReplyToMessagesenderName(messageDetails);
    PatientMessageDetailsPage.ReplyToMessagerecipientName(messageDetails);
    PatientMessageDetailsPage.ReplyToMessageDate(messageDetails);
    PatientMessageDetailsPage.ReplyToMessageId(messageDetails);

    messageDetails.data.attributes.body = messageDetailsBody;
    PatientMessageDetailsPage.ReplyToMessagebody(testMessageBody);

    PatientReplyPage.sendReplyDraft(
      messageDetails.data.attributes.messageId,
      messageDetails.data.attributes.senderId,
      messageDetails.data.attributes.category,
      messageDetails.data.attributes.subject,
      testMessageBody,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
