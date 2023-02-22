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
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
  });
  it('verify Print Button', () => {
    messageDetailsKeyboard.verifyPrintCancelButton();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
  it('verify Trash Button', () => {
    messageDetailsKeyboard.verifyTrash();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[class="usa-button-secondary"]').should('exist');
  });
  it('verify Reply Button', () => {
    messageDetailsKeyboard.verifyReply();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"]').should('exist');
  });
});
