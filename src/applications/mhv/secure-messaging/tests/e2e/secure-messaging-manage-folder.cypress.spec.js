import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockFolderWithoutMessages from './fixtures/customResponse/folder-no-messages-response.json';

describe('create custom folder', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const newFolder = `folder${Date.now()}`;
  mockFolders.data.push(createdFolderResponse.data);

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
  });
  it('verify create folder success message', () => {
    PatientMessageCustomFolderPage.createCustomFolder(newFolder);
    folderPage.verifyCreateFolderSuccessMessage();
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

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}?useCache=false`,
      createdFolderResponse,
    ).as('singleFolder');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads?*`,
      mockFolderWithoutMessages,
    ).as('singleFolderThread');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      mockFolderWithoutMessages,
    ).as('foldersWithZero');

    cy.contains(folderName).click({ waitForAnimations: true });
  });
  it('verify delete folder success message', () => {
    mockFolders.data.pop(createdFolderResponse.data);

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderId}`, {
      statusCode: 204,
    }).as('deleteFolder');

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders?page=1&per_page=999&useCache=false',
      mockFolders,
    ).as('updatedFoldersList');

    folderPage.deleteFolder();

    folderPage.verifyDeleteSuccessMessage();
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
