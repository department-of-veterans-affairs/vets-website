import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { Alerts, AXE_CONTEXT, Data } from '../utils/constants';

describe('SM VERIFY COMPOSE DATA ON CANCEL NAVIGATE AWAY', () => {
  it('verify data remains in the fields', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();

    FolderLoadPage.backToParentFolder();

    PatientComposePage.verifyCantSaveAlert(
      Alerts.SAVE_DRAFT,
      Data.BUTTONS.SAVE_DRAFT,
    );

    PatientComposePage.closeAlertModal();

    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();
  });
});
