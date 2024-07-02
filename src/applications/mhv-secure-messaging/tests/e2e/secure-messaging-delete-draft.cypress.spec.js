import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Delete Draft', () => {
  const draftsPage = new PatientMessageDraftsPage();
  it(' Delete Existing Draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    PatientInterstitialPage.getContinueButton().should('not.exist');
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    draftsPage.confirmDeleteDraft(mockDraftResponse);
    // draftsPage.verifyDeleteConfirmationMessage();
    // draftsPage.verifyDeleteConfirmationHasFocus();
    // draftsPage.verifyDraftMessageBannerTextHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
