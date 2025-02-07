import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockSavedDraftResponse from './fixtures/draftPageResponses/single-draft-response.json';
import { AXE_CONTEXT, Data, Alerts } from './utils/constants';

describe('Secure Messaging Draft Save with Attachments', () => {
  it('Axe Check Draft Save with Attachments', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();
    PatientComposePage.attachMessageFromFile();

    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockSavedDraftResponse.data[0].attributes.messageId
      }`,

      { statusCode: 204 },
    ).as('saveDraft');

    PatientComposePage.clickSaveDraftBtn();
    PatientMessageDraftsPage.verifySaveWithAttachmentAlert();

    PatientMessageDraftsPage.verifyCantSaveAlert(
      Alerts.SAVE_ATTCH,
      Data.BUTTONS.EDIT_DRAFT,
      Data.BUTTONS.SAVE_DRAFT_WO_ATTCH,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageDraftsPage.closeModal();
  });
});
