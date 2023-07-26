import mockThreadResponse from '../fixtures/customResponse/custom-thread-response.json';
import mockCustomFolderMetaResponse from '../fixtures/customResponse/folder-custom-metadata.json';
import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';

class PatientMessageCustomFolderPage {
  loadMessages = (
    folderName = mockCustomFolderMetaResponse.data.attributes.name,
    folderNumber = mockCustomFolderMetaResponse.data.attributes.folderId,
    mockMessagesResponse = mockThreadResponse,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderNumber}`,
      mockCustomFolderMetaResponse,
    ).as('customFolder');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderNumber}/threads**`,
      mockMessagesResponse,
    ).as('customFolderMessages');

    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains(`${folderName}`).click();
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
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

    cy.get('[data-testid="thread-list-item"]')
      .first()
      .click();
  };
}

export default new PatientMessageCustomFolderPage();
