import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Data, Alerts } from '../utils/constants';

describe('SM NAVIGATE AWAY FROM SAVED DRAFT', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();
  });

  it('navigate away with no data change', () => {
    FolderLoadPage.backToParentFolder();
    GeneralFunctionsPage.verifyUrl(`drafts`);
    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with data change', () => {
    PatientComposePage.selectRecipient(3);

    FolderLoadPage.backToParentFolder();

    PatientMessageDraftsPage.verifyCantSaveAlert(
      Alerts.SAVE_CHANGES,
      Data.BUTTONS.SAVE_CHANGES,
      Data.BUTTONS.DELETE_CHANGES,
    );

    PatientMessageDraftsPage.clickDeleteChangesButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with added attachment', () => {
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

  it('navigate away with data change and attachment', () => {
    PatientComposePage.selectRecipient(2);
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

  it('navigate away with removed data', () => {
    PatientComposePage.selectRecipient(0);
    PatientComposePage.getMessageSubjectField().clear();
    PatientComposePage.getMessageBodyField()
      .focus()
      .clear();

    FolderLoadPage.backToParentFolder();
    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with removed data and added attachment', () => {
    PatientComposePage.selectRecipient(0);
    PatientComposePage.getMessageSubjectField().clear();
    PatientComposePage.getMessageBodyField()
      .focus()
      .clear();
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToParentFolder();
    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
