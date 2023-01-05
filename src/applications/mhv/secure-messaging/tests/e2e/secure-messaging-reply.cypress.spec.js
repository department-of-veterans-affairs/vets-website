import manifest from '../../manifest.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';

describe(manifest.appName, () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientMessagesInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const replyPage = new PatientReplyPage();
    landingPage.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    messageDetailsPage.loadReplyPage(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
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
