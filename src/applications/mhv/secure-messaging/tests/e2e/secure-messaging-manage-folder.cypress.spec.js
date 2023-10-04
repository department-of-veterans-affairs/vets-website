import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('create custom folder', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const folderName = createdFolderResponse.data.attributes.name;
  const newFolder = `folder${Date.now()}`;
  mockFolders.data.push(createdFolderResponse.data);

  before(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
  });

  it('verify folder created', () => {
    PatientMessageCustomFolderPage.createCustomFolder(newFolder);

    folderPage.verifyCreateFolderSuccessMessage();

    cy.get('.folders-list').should('contain.text', folderName);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
describe('delete custom folder', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const folderName = createdFolderResponse.data.attributes.name;
  const { folderId } = createdFolderResponse.data.attributes;

  before(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
  });

  it('verify folder deleted', () => {
    PatientMessageCustomFolderPage.loadSingleFolderWithNoMessages(
      folderId,
      folderName,
    );
    mockFolders.data.pop(createdFolderResponse.data);

    folderPage.deleteFolder(folderId);

    folderPage.verifyDeleteSuccessMessage();

    cy.get('.folders-list').should('not.contain.text', folderName);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
