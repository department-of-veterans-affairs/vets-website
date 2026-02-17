import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientReplyPage from './pages/PatientReplyPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import FolderManagementPage from './pages/FolderManagementPage';

describe('SM DELETE REPLY DRAFT', () => {
  const updatedSingleThreadResponse =
    GeneralFunctionsPage.updatedThreadDates(singleThreadResponse);
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_custom_folders_redesign',
      value: false,
    },
    {
      name: 'mhv_secure_messaging_curated_list_flow',
      value: false,
    },
  ]);
  it('verify user can delete draft on reply', () => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    FolderManagementPage.selectFolderFromModal();
    FolderManagementPage.confirmMovingMessageToFolder();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationHasFocus();
    GeneralFunctionsPage.verifyPageHeader('Messages: Inbox');
    GeneralFunctionsPage.verifyUrl(`inbox`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
