import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import MockFoldersResponse from './fixtures/folder-response.json';
import mockMessages from './fixtures/messages-response.json';
import mockRecipients from './fixtures/recipients-response.json';
import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import FolderManagementPage from './pages/FolderManagementPage';

describe('Secure Messaging Manage Folder Errors check', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Axe Check Get Folders Error', () => {
    const testMessage = PatientInboxPage.getNewMessageDetails();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      testMessage,
      mockRecipients,
      400,
    );
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Axe Check Delete Folder Network Error', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    const folderName = MockFoldersResponse.data.at(4).attributes.name;
    const folderID = MockFoldersResponse.data.at(4).attributes.folderId;
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderID}`,
      MockCustomFolderResponse,
    ).as('customFolderID');
    cy.intercept(
      'GET',
      `my_health/v1/messaging/folders/${folderID}/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as('customFolderThreads');
    cy.contains(folderName).click();

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderID}`, {
      forceNetworkError: true,
    }).as('deleteCustomMessage');
    cy.get('[data-testid="remove-folder-button"]').click();
    cy.get('[text="Remove"]')
      .shadow()
      .find('[type="button"]')
      .click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Create Folder Network Error Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    FolderManagementPage.createANewFolderButton().click();
    const createFolderName = 'create folder test';
    FolderManagementPage.createFolderTextBox().type(createFolderName, {
      waitforanimations: true,
      force: true,
    });
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
    FolderManagementPage.createFolderModalButton().click();
    FolderManagementPage.verifyCreateFolderNetworkFailureMessage();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Create Folder Input Field Error check on blank value submit', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    FolderManagementPage.createANewFolderButton().click();
    FolderManagementPage.createFolderModalButton().click();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[name="folder-name"]')
      .shadow()
      .find('input')
      .should('be.focused');
    cy.get('[name="folder-name"]')
      .shadow()
      .find('#input-error-message')
      .should(err => {
        expect(err).to.contain('Folder name cannot be blank');
      });
  });
});
