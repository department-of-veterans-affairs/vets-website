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
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().attributes.recipientId,
    );
    messageDetailsPage.loadReplyPage(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().attributes.recipientId,
    );
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
    cy.injectAxe();
    cy.axeCheck();
    replyPage.sendReplyMessage(
      landingPage.getNewMessage().attributes.messageId,
    );
  });
});
