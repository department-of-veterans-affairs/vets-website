import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { Alerts, AXE_CONTEXT, Data } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';
import mockReplyDraftResponse from '../fixtures/draftPageResponses/single-reply-draft-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM NAVIGATE AWAY FROM SAVED REPLY DRAFT', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleReplyDraft(
      GeneralFunctionsPage.updatedThreadDates(mockReplyDraftResponse),
    );
  });

  it('navigate away with no changes', () => {
    FolderLoadPage.backToParentFolder();

    GeneralFunctionsPage.verifyUrl(`drafts`);
    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with no data changes and attachment', () => {
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_ATTCH,
      Data.BUTTONS.EDIT_DRAFT,
      Data.BUTTONS.SAVE_DRAFT_WO_ATTCH,
    );

    PatientComposePage.clickSaveDraftWithoutAttachmentBtn();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with changed data', () => {
    PatientComposePage.typeMessageBody('updated data');

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_CHANGES,
      Data.BUTTONS.SAVE_CHANGES,
      Data.BUTTONS.DELETE_CHANGES,
    );

    PatientMessageDraftsPage.clickDeleteChangesButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with changed data and attachment', () => {
    PatientComposePage.typeMessageBody('updated data');
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_ATTCH,
      Data.BUTTONS.EDIT_DRAFT,
      Data.BUTTONS.SAVE_DRAFT_WO_ATTCH,
    );

    PatientComposePage.clickSaveDraftWithoutAttachmentBtn();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
