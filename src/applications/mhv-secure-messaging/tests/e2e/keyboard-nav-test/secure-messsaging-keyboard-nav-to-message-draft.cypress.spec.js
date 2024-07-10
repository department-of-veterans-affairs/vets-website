import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockThreadResponse from '../fixtures/single-draft-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Delete Draft', () => {
  const draftsPage = new PatientMessageDraftsPage();

  it('delete Drafts on key press', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    draftsPage.clickDeleteButton();

    draftsPage.confirmDeleteDraftWithEnterKey(mockDraftResponse);
    draftsPage.verifyDeleteConfirmationMessage();
    draftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
