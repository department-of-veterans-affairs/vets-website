import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Delete Draft', () => {
  it(' Delete Existing Draft', () => {
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
    PatientInterstitialPage.getContinueButton().should('not.exist');
    PatientMessageDraftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageDraftsPage.confirmDeleteDraft(mockDraftResponse);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDeleteConfirmationButton();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
