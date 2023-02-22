import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsKeyboardPage from '../pages/PatientMessageDetailsKeyboardPage';

describe('Secure Messaging Message Details keyboard Page', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const messageDetailsKeyboard = new PatientMessageDetailsKeyboardPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Message Details Keyboard Page', () => {
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    messageDetailsKeyboard.verifyPrintCancelButton();
    messageDetailsKeyboard.verifyPrintConfirmButton();
    // messageDetailsKeyboard.verifyTrash();
    messageDetailsKeyboard.verifyMoveTo();
    messageDetailsKeyboard.verifyReply();
    cy.tabToElement('[data-testid=message-body-field]').should('exist');
  });
});
