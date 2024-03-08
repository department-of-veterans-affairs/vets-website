import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import requestBody from './fixtures/message-compose-request-body.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Delete Draft Navigate to Inbox', () => {
  it('Navigates to Inbox after Delete Draft Confirmation', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBody.subject}`);
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    draftsPage.confirmDeleteDraft(mockDraftResponse, true);
    draftsPage.verifyDeleteConfirmationMessage();
    cy.get(Locators.FOLDERS.SIDEBAR).find('a');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
