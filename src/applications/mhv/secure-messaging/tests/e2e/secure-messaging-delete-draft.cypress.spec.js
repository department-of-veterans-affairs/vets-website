import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';

describe('Secure Messaging Delete Draft', () => {
  it(' Delete Drafts', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDraftMessages(
      mockDraftMessages,
      mockDraftResponse,
    );
    PatientMessageDraftsPage.loadMessageDetails(
      mockDraftResponse,
      mockThreadResponse,
    );
    PatientInterstitialPage.getContinueButton().click({ force: true });
    PatientMessageDraftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    PatientMessageDraftsPage.confirmDeleteDraft(mockDraftResponse);
    PatientInboxPage.verifyDeleteConfirmMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
