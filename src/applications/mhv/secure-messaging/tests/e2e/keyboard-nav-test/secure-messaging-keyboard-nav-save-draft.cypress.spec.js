import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  it('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();
    inboxPage.loadComposeMessagePage();
    inboxPage.composeDraft();
    // cy.axeCheck;
    cy.injectAxe();
    inboxPage.saveDraftByKeyboard();
    cy.get('.last-save-time').should('be.visible');
    cy.get('.last-save-time').should('be.focused');
  });
});
