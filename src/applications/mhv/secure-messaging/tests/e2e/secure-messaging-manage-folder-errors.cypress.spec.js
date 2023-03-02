import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import MockFoldersResponse from './fixtures/folder-response.json';
import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import FolderManagementPage from './pages/FolderManagementPage';

describe('Secure Messaging Manage Folder Errors check', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
  });
  it('Axe Check Get Folders Error', () => {
    landingPage.loadPage(false, 400);
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Axe Check Delete Folder Network Error', () => {
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    const folderName = MockFoldersResponse.data.at(4).attributes.name;
    const folderID = MockFoldersResponse.data.at(4).attributes.folderId;
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderID}`,
      MockCustomFolderResponse,
    ).as('customFolderID');
    cy.contains(folderName).click();

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderID}`, {
      forceNetworkError: true,
    });
    cy.get('[data-testid="remove-folder-button"]').click();
    cy.get('[text="Remove"]')
      .shadow()
      .find('[type="button"]')
      .click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Create Folder Network Error Check', () => {
    landingPage.loadPage();
    cy.get('[data-testid="my-folders-sidebar"]').click();
    folderPage.createANewFolderButton().click();
    const createFolderName = 'create folder test';
    folderPage.createFolderTextBox().type(createFolderName);
    cy.intercept('POST', '/my_health/v1/messaging/folder', {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folder');
    folderPage.createFolderModalButton().click();
    folderPage.verifyCreateFolderNetworkFailureMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
