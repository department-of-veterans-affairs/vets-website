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

  verifyFolderHeader = (
    text = mockCustomFolderMetaResponse.data.attributes.name,
  ) => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };

  verifyResponseBodyLength = (responseData = mockThreadResponse) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );
  };
}

export default new PatientMessageCustomFolderPage();
