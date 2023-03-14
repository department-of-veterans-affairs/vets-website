import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();
    // const messageDetails = landingPage.setMessageDateToYesterday();
    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    const testMessageBody = 'Test message body';
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type(testMessageBody);
    cy.injectAxe();
    cy.axeCheck();

    replyPage.saveReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );
    // replyPage.ReplyDraftData();
    cy.get('@replyDraftMessage')
      .its('request.body')
      .then(message => {
        expect(message.recipientId).to.eq(20029);
        expect(message.subject).to.eq('Medication-Inquiry');
        expect(message.body).to.eq('Test message body');
      });
    cy.get('@replyDraftMessage')
      .its('response.body')
      .then(message => {
        expect(message.data.attributes.messageId).to.eq(7179970);
        expect(message.data.attributes.recipientName).to.eq('ECSTEN, THOMAS ');
        expect(message.data.attributes.body).to.eq('Test message body');
      });

    replyPage.sendReplyDraft(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    replyPage.ReplyDraftData(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.senderId,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.subject,
      testMessageBody,
    );
  });
});
