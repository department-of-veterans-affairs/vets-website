import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import FolderManagementPage from './pages/FolderManagementPage';

describe('Secure Messaging - Move Message with Attachment', () => {
  it('can move with attachment', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    const singleMessage = { data: updatedSingleThreadResponse.data[0] };
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    FolderManagementPage.selectFolderFromModal();
    FolderManagementPage.confirmMovingMessageToFolder(singleMessage);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
  });
});
