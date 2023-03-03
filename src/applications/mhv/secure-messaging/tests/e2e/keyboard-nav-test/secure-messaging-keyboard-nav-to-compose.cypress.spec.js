import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging Keyboard Nav To Compose', () => {
  const site = new SecureMessagingSite();
  const patientInboxPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    patientInboxPage.loadInboxMessages();
  });
  it('Keyboard Nav from Welcome Page to Compose', () => {
    cy.tabToElement('[data-testid="compose-message-link"]');
    cy.realPress(['Enter']);
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"] ');
  });
});
