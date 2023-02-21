import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.setDynamicMessage(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().recipientId,
    );
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().recipientId,
    );
    messageDetailsPage.loadReplyPage(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().attributes.recipientId,
    );
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
  });
});
