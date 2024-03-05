import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('remove folder error modal', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const folderName =
    mockFolders.data[mockFolders.data.length - 1].attributes.name;
  const { folderId } = mockFolders.data[mockFolders.data.length - 1].attributes;

  before(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList(mockFolders);
  });

  it('verify modal message', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    // cy.pause();
    PatientMessageCustomFolderPage.loadSingleFolderWithMessages(
      folderId,
      folderName,
    );
    folderPage.deleteFolderButton().click();

    cy.get('[data-testid="error-folder-not-empty"] p').should(
      'include.text',
      "can't remove a folder with messages",
    );

    cy.get('[text="Ok"]')
      .shadow()
      .find('[type="button"]')
      .should('be.visible')
      .click();

    cy.get('h1')
      .should('be.visible')
      .and('have.text', folderName);
  });
});
