import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/folder-response.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

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

    FolderManagementPage.verifyFolderActionMessage(
      Data.FOLDER_CREATED_SUCCESSFULLY,
    );
    FolderManagementPage.verifyFolderActionMessageHasFocus();
    FolderManagementPage.verifyFolderInList(`eq`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify folder deleted`, () => {
    PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);

    PatientMessageCustomFolderPage.loadCustomFolderWithNoMessages();

    cy.findByText(
      'There are no messages in this folder. If this folder is no longer needed, you can remove it.',
    ).should('be.visible');

    FolderManagementPage.clickDeleteFolderButton();

    PatientMessageCustomFolderPage.deleteCustomFolder();
    FolderManagementPage.verifyFolderActionMessage(
      Data.FOLDER_REMOVED_SUCCESSFULLY,
    );
    FolderManagementPage.verifyFolderActionMessageHasFocus();
    FolderManagementPage.verifyFolderInList(`not.eq`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify custom folder description in edit section', () => {
    PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);

    // Load the custom folder with no messages
    PatientMessageCustomFolderPage.loadCustomFolderWithNoMessages();

    // Verify the empty folder alert is visible
    cy.findByText(
      'There are no messages in this folder. If this folder is no longer needed, you can remove it.',
    ).should('be.visible');

    // Verify the custom folder description is NOT in the folder header
    cy.get('[data-testid="folder-description"]').should('not.exist');

    // Verify the va-additional-info component is visible in the Edit folder section
    cy.get('.custom-folder-info')
      .should('exist')
      .and('have.attr', 'trigger', 'How can I use a custom folder?');

    // Click on the va-additional-info to expand it
    cy.get('.custom-folder-info').click();

    // Verify the expanded content contains the expected text
    cy.get('.custom-folder-info').should(
      'contain',
      'This is a folder you created. You can add conversations to this folder by moving them from your inbox or other folders.',
    );

    // Click again to collapse
    cy.get('.custom-folder-info').click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
