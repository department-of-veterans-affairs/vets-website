import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import mockThreadResponse from '../fixtures/trashResponse/trash-thread-response.json';
import mockSingleMessageResponse from '../fixtures/trashResponse/trash-single-message-response.json';

class PatientMessageTrashPage {
  // mockTrashMessages = mockDraftMessagesResponse;
  //
  // mockDetailedMessage = mockTrashResponse;
  //
  // currentThread = defaultMockThread;

  loadTrashMessages = (mockMessagesResponse = mockTrashMessages) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockTrashFolderMetaResponse,
    ).as('trashFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/threads**',
      mockMessagesResponse,
    ).as('trashFolderMessages');
    cy.get('[data-testid="trash-sidebar"]').click();
  };

  loadDetailedTrashMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockThreadResponse,
    ).as('threadResponse');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        detailedMessage.data.attributes.messageId
      }`,
      mockSingleMessageResponse,
    ).as('detailedMessage');

    cy.get('[data-testid="thread-list-item"]').first.click();
  };

  verifyFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };
}

export default new PatientMessageTrashPage();
