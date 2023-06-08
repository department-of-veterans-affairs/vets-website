import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  it('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();
    inboxPage.loadComposeMessagePage();
    inboxPage.composeDraft();
    inboxPage.saveDraft();
    cy.get('#save-draft-button').click();
    // next line is just for check the assertion works
    // cy.get('#save-draft-button').should('be.focused');
    cy.get('.last-save-time').should('be.focused');
    // cy.axeCheck();
    cy.injectAxe();
  });
});
