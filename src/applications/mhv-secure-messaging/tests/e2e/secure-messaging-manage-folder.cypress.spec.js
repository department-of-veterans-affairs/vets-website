import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/folder-response.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

for (let i = 0; i < 1; i += 1) {
  describe('manage custom folders', () => {
    const updatedFolders = {
      ...mockFolders,
      data: [...mockFolders.data, createdFolderResponse.data],
    };

    beforeEach(() => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
    });

    it('verify folder created', () => {
      PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);

      FolderManagementPage.verifyCreateFolderSuccessMessage();
      FolderManagementPage.verifyCreateFolderSuccessMessageHasFocus();
      FolderManagementPage.verifyCreatedFolderVisible();

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it(`verify folder deleted`, () => {
      PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);
      // cy.get(`[close-btn-aria-label="Close notification"]`).shadow().find(`va-icon`).click();

      //
      // cy.intercept(`GET`, `${Paths.SM_API_BASE}/folders/${createdFolderResponse.data.attributes.folderId}*`, createdFolderResponse).as(`createdFolderResponse`)
      // cy.intercept(`GET`, `${Paths.SM_API_BASE}/folders/${createdFolderResponse.data.attributes.folderId}/threads*`, {"data":[]}).as(`emptyFolderThread`)
      //
      //
      // cy.get(`[data-testid = ${createdFolderResponse.data.attributes.name}]>a`).click();

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    // describe('verify folder deleted', () => {
    // const folderName = createdFolderResponse.data.attributes.name;
    // const { folderId } = createdFolderResponse.data.attributes;
    // mockFolders.data.push(createdFolderResponse.data);
    //
    // before(() => {
    //   SecureMessagingSite.login();
    //   PatientInboxPage.loadInboxMessages();
    //   FolderLoadPage.loadFolders();
    // });
    //
    // it('verify message and focus', () => {
    //   cy.injectAxe();
    //   cy.axeCheck(AXE_CONTEXT, {});
    //
    //   PatientMessageCustomFolderPage.loadSingleFolderWithNoMessages(
    //     folderId,
    //     folderName,
    //   );
    //   FolderManagementPage.deleteFolderButton().click();
    //   FolderManagementPage.confirmDeleteFolder(folderId);
    //   FolderManagementPage.verifyDeleteSuccessMessageText();
    //   FolderManagementPage.verifyDeleteSuccessMessageHasFocus();
    // });
    // });
  });
}
