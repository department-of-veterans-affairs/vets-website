import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockFoldersResponse from './fixtures/folder-response.json';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Move Message to New Folder tests', () => {
  it(`move message from inbox to new folder`, () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadSingleThread();

    const updatedFoldersList = {
      ...mockFoldersResponse,
      data: [...mockFoldersResponse.data, createdFolderResponse.data],
    };

    FolderManagementPage.selectFolderFromModal(`Create new folder`);
    FolderManagementPage.moveMessageToNewFolder(updatedFoldersList);

    // backToInbox just hits the back button.
    FolderManagementPage.backToInbox();

    GeneralFunctionsPage.verifyUrl(
      `folders/${createdFolderResponse.data.attributes.folderId}`,
    );

    cy.get(`va-alert`).should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
