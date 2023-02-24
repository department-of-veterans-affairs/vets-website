import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Reply to Expired Mesage', () => {
  it('reply expired messages', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getExpired46DayOldMessage().attributes.messageId,
      landingPage.getExpired46DayOldMessage().attributes.subject,
      landingPage.getExpired46DayOldMessage().attributes.body,
      landingPage.getExpired46DayOldMessage().attributes.category,
      landingPage.getExpired46DayOldMessage().attributes.sentDate,
      landingPage.getExpired46DayOldMessage().attributes.recipientId,
    );

    cy.get('[data-testid=expired-alert-message]').should(
      'have.text',
      'This conversation is too old for new replies',
    );
    cy.get('[data-testid=expired-alert-message]+p').should(
      'have.text',
      "The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.",
    );

    cy.injectAxe();
    cy.axeCheck();
  });
});
