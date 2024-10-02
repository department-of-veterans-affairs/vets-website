import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Data, Alerts, Locators } from '../utils/constants';

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
    GeneralFunctionsPage.verifyPageHeader(`Drafts`);
  });

  it('navigate away with data change', () => {
    PatientComposePage.selectRecipient();

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_DRAFT,
      Data.BUTTONS.SAVE_DRAFT,
    );

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  // TODO this is a bug - verify with Vic
  it.skip('navigate away with added attachment', () => {
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
    PatientComposePage.selectRecipient();
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
    cy.get(Locators.MESSAGE_SUBJECT).clear({ force: true });
    cy.get(Locators.MESSAGE_BODY).clear({ force: true });

    FolderLoadPage.backToParentFolder();
    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with removed data and added attachment', () => {
    PatientComposePage.selectRecipient(0);
    cy.get(Locators.MESSAGE_SUBJECT).clear({ force: true });
    cy.get(Locators.MESSAGE_BODY).clear({ force: true });
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToParentFolder();
    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
