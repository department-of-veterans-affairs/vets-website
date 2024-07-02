import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftResponse from './fixtures/message-draft-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Delete Draft Navigate to Inbox', () => {
  it('Navigates to Inbox after Delete Draft With No Changes and No Confirmation', () => {
    const draftsPage = new PatientMessageDraftsPage();
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    draftsPage.verifyDeleteConfirmationMessage();
    cy.get(Locators.HEADER_FOLDER).should('have.text', 'Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
