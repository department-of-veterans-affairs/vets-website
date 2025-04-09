import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockThread from './fixtures/thread-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Move Message tests', () => {
  it(`move message from inbox to new folder`, () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadSingleThread();

    const updatedFoldersList = {
      ...mockFoldersResponse,
      data: [...mockFoldersResponse.data, createdFolderResponse.data],
    };

    FolderManagementPage.selectFolderFromModal(`newFolder`);
    FolderManagementPage.moveMessageToNewFolder(updatedFoldersList);

    FolderManagementPage.backToCreatedFolder(mockThread);

    GeneralFunctionsPage.verifyUrl(
      createdFolderResponse.data.attributes.folderId,
    );

    cy.get(':focus').should(
      'have.text',
      createdFolderResponse.data.attributes.name,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
