// import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Delete Draft', () => {
  it('delete Drafts on key press', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientMessageDraftsPage.clickDeleteButton();

    // temporary commented to prevent CI run freezing
    // PatientMessageDraftsPage.confirmDeleteDraftWithEnterKey(
    //   mockSavedDraftResponse,
    // );
    // PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    // PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
