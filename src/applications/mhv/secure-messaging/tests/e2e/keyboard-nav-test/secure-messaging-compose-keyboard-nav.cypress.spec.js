import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Compose Form Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Tab to Message Body', () => {
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"] ').should('exist');
  });
  it('Tab to Save Draft Button', () => {
    cy.get('[data-testid="compose-message-link"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="Save-Draft-Button"]').should('exist');
  });
});
