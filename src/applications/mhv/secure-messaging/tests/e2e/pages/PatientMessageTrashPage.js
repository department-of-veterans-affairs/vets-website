import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';

class PatientMessageTrashPage {
  // mockTrashMessages = mockDraftMessagesResponse;
  //
  // mockDetailedMessage = mockTrashResponse;
  //
  // currentThread = defaultMockThread;

  loadTrashMessagesTest = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockTrashFolderMetaResponse,
    ).as('trashFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/threads**',
      mockTrashMessages,
    ).as('trashFolderMessages');
    cy.get('[data-testid="trash-sidebar"]').click();
  };

  verifyFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };
}

export default new PatientMessageTrashPage();
