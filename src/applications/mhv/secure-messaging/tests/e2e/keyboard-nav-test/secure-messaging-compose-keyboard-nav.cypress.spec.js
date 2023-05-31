import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Compose Form Keyboard Nav', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Tab to Message Body', () => {
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"] ').should('exist');
  });
  it('Tab to Save Draft Button', () => {
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="Save-Draft-Button"]').should('exist');
  });
});
