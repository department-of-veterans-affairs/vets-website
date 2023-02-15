import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsKeyboardPage from '../pages/PatientMessageDetailsKeyboardPage';

describe('Secure Messaging Message Details keyboard Check', () => {
  it('Message Details Keyboard', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const messageDetailsKeyboard = new PatientMessageDetailsKeyboardPage();
    site.login();
    landingPage.loadPage();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    messageDetailsKeyboard.verifyPrint();
    messageDetailsKeyboard.verifyTrash();
    messageDetailsKeyboard.verifyMoveTo();
    cy.injectAxe();
    cy.axeCheck();
    // cy.tabToElement('[data-testid=move-button-text]').should('exist');
  });
});
