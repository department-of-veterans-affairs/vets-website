import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import mockMessages from '../fixtures/messages-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { Alerts, AXE_CONTEXT, Data } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';

describe('SM NAVIGATE AWAY FROM MESSAGE COMPOSE', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(mockMessages, testMessage);
    PatientMessageDetailsPage.loadMessageDetails(testMessage);
    PatientMessageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
  });

  it('navigate away with no data', () => {
    FolderLoadPage.backToInbox();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with no data and attachment', () => {
    PatientComposePage.attachMessageFromFile();

    FolderLoadPage.backToInbox();

    PatientComposePage.verifyCantSaveAlert(Data.MESSAGE_CANNOT_SAVE_YET);

    PatientComposePage.clickDeleteDraftModalButton();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with required data', () => {
    PatientComposePage.enterDataToMessageBody();

    FolderLoadPage.backToInbox();

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

    FolderLoadPage.backToInbox();

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
