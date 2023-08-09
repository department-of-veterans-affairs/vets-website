import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderManagementPage from '../pages/FolderManagementPage';
import mockCustomFolderResponse from '../fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from '../fixtures/message-custom-response.json';
import mockFoldersResponse from '../fixtures/folder-response.json';
import mockCustomDetails from '../fixtures/custom-response.json';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import mockMessages from '../fixtures/messages-response.json';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';

describe('Secure Messaging Keyboard Nav Move Message from CustomFolder', () => {
  it('move message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const folderPage = new FolderManagementPage();
    const folderName = mockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = mockFoldersResponse.data.at(4).attributes;
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid ="my-folders-sidebar"]').click();

    folderPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    folderPage.loadCustomFolderMessageDetails(mockCustomDetails);
    folderPage.selectFolderfromModal();
    folderPage.moveCustomFolderMessageToDifferentFolder();
    folderPage.verifyMoveMessageSuccessConfirmationFocus();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});

describe('Move message to another folder ', () => {
  it('Keyboard Navigation to Print Button', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessagewithAttachment);

    cy.intercept(
      'PATCH',
      'my_health/v1/messaging/threads/7176615/move?folder_id=-3',
      {},
    );

    cy.get('[data-testid="move-button-text"]').click();

    cy.get('va-radio[class="form-radio-buttons hydrated"]')
      .find('[for="radiobutton-Deleted"]')
      .should('exist')
      .click();

    cy.get('[type="button"]')
      .contains('Confirm')
      .should('exist')
      .click();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });

    cy.get('[close-btn-aria-label="Close notification"]')
      .should('exist')
      .and('have.text', 'Message conversation was successfully moved.');
  });
});
