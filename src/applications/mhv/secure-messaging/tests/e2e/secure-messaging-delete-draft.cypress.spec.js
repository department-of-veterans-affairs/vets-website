import mockDraftMessages from './fixtures/drafts-response.json';
import mockThreadResponse from './fixtures/message-draft-thread-response-single-message.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe('Secure Messaging Delete Draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftsPage = new PatientMessageDraftsPage();
  it(' Delete Drafts', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    cy.contains('successfully deleted').should(
      'have.text',
      'Draft was successfully deleted.',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
