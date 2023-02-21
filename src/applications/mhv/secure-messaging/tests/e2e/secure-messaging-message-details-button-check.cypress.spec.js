import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details Buttons Check', () => {
  it('Message Details Buttons Check', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const messageDetailsPage = new PatientMessageDetailsPage();
    site.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().recipientId,
    );
    messageDetailsPage.verifyTrashButtonModal();
    messageDetailsPage.verifyMoveToButtonModal();
    messageDetailsPage.verifyReplyButtonAction();
    cy.injectAxe();
    cy.axeCheck();
  });
});
