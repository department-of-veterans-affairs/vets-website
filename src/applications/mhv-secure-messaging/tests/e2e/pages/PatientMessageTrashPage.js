import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockThreadResponse from '../fixtures/trashResponse/trash-thread-response.json';
import mockSingleMessageResponse from '../fixtures/trashResponse/trash-single-message-response.json';
import { Locators, Paths } from '../utils/constants';
import FolderLoadPage from './FolderLoadPage';

class PatientMessageTrashPage {
  loadMessages = (mockMessagesResponse = mockTrashMessages) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3*`,
      mockTrashFolderMetaResponse,
    ).as('trashFolder');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/threads**`,
      mockMessagesResponse,
    ).as('trashFolderMessages');
    FolderLoadPage.loadFolders();
    cy.get('[data-testid="Deleted"]>a').click({ force: true });
    cy.wait('@trashFolder');
    cy.wait('@trashFolderMessages');
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockThreadResponse,
    ).as('threadResponse');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }`,
      mockSingleMessageResponse,
    ).as('detailedMessage');

    cy.get(Locators.THREADS)
      .first()
      .click();
  };

  verifyFolderHeaderText = text => {
    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('have.text', `${text}`);
  };

  // method below could not be used in filtered list due to different tag ([data-testid="message-list-item"])
  verifyResponseBodyLength = (responseData = mockTrashMessages) => {
    cy.get(Locators.THREADS).should(
      'have.length',
      `${responseData.data.length}`,
    );
  };
}

export default new PatientMessageTrashPage();
