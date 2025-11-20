import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import singleThreadResponse from '../fixtures/thread-response-new-api.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { Alerts, AXE_CONTEXT, Data } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientReplyPage from '../pages/PatientReplyPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';

describe('SM NAVIGATE AWAY FROM UNSAVED REPLY DRAFT', () => {
  const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleThreadResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();
  });

  it('navigate away with no data', () => {
    FolderLoadPage.backToParentFolder();

    // when you're replying, you can see the message thread already.
    // back button will navigate back to the folder you came from. In this case, inbox.
    GeneralFunctionsPage.verifyUrl(`inbox`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with no data and attachment', () => {
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with required data', () => {
    PatientComposePage.getMessageBodyField().type(`\nupdatedData`, {
      force: true,
    });

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_DRAFT,
      Data.BUTTONS.SAVE_DRAFT,
    );

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with required data and attachment', () => {
    PatientComposePage.enterDataToMessageBody();
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
