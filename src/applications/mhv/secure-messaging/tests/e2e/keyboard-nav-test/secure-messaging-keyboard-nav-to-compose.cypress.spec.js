import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging Keyboard Nav To Compose', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Keyboard Nav from Welcome Page to Compose', () => {
    cy.tabToElement('[data-testid="compose-message-link"]');
    cy.realPress(['Enter']);
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="continue-button"] ');
    cy.realPress(['Enter']);
    cy.tabToElement('[data-testid="message-body-field"] ');
  });
});
