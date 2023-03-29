import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    const testMessageBody = 'Test message body';
    composePage.getMessageBodyField().type(testMessageBody);
    cy.injectAxe();
    cy.axeCheck();

    replyPage.saveReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );

    messageDetailsPage.ReplyToMessageTO(messageDetails);
    messageDetailsPage.ReplyToMessagesenderName(messageDetails);
    messageDetailsPage.ReplyToMessagerecipientName(messageDetails);
    messageDetailsPage.ReplyToMessageDate(messageDetails);
    messageDetailsPage.ReplyToMessageId(messageDetails);
    messageDetailsPage.ReplyToMessagebody(messageDetails);

    replyPage.sendReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
