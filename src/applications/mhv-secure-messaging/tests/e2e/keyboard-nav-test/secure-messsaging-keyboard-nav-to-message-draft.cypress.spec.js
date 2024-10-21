import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import mockThreadResponse from '../fixtures/single-draft-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Delete Draft', () => {
  it('delete Drafts on key press', () => {
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
    PatientMessageDraftsPage.clickDeleteButton();

    PatientMessageDraftsPage.confirmDeleteDraftWithEnterKey(mockDraftResponse);
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
