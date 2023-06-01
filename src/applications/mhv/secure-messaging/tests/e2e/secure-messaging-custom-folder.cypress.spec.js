import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Custom Folder AXE Check', () => {
  it('Axe Check Custom Folder List', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
