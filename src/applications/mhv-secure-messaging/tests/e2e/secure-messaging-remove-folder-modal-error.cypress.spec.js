import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockFolders from './fixtures/folder-response.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('remove folder error modal', () => {
  const folderName =
    mockFolders.data[mockFolders.data.length - 1].attributes.name;
  const { folderId } = mockFolders.data[mockFolders.data.length - 1].attributes;

  before(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
  });

  it('verify modal message', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageCustomFolderPage.loadSingleFolderWithMessages(
      folderId,
      folderName,
    );
    FolderManagementPage.clickDeleteFolderButton();

    cy.get(Locators.FOLDERS.NOT_EMP_FOLDER).should(
      'include.text',
      "can't remove a folder with messages",
    );

    cy.get('[text="Ok"]')
      .shadow()
      .find('[type="button"]')
      .should('be.visible')
      .click();

    cy.get(Locators.HEADER)
      .should('be.visible')
      .and('have.text', `Messages: ${folderName}`);
  });
});
