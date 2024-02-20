import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Delete Draft Navigate to Inbox', () => {
  it('Navigates to Inbox after Delete Draft With No Changes and No Confirmation', () => {
    const landingPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    draftsPage.clickDeleteButton();
    draftsPage.verifyDeleteConfirmationMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    cy.get('[data-testid="inbox-sidebar"]')
      .find('a')
      .should('have.class', 'is-active');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
