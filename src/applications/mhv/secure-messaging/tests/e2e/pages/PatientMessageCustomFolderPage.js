import mockCustomFolderMessages from '../fixtures/customResponse/custom-folder-messages-response.json';
import mockThreadResponse from '../fixtures/customResponse/custom-thread-response.json';
import mockCustomFolderMetaResponse from '../fixtures/customResponse/folder-custom-metadata.json';
import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';
import mockSortedMessages from '../fixtures/customResponse/sorted-custom-folder-messages-response.json';

class PatientMessageCustomFolderPage {
  loadMessages = (
    folderName = mockCustomFolderMetaResponse.data.attributes.name,
    folderNumber = mockCustomFolderMetaResponse.data.attributes.folderId,
    mockMessagesResponse = mockCustomFolderMessages,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderNumber}*`,
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

  verifyResponseBodyLength = (responseData = mockCustomFolderMessages) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  sortMessagesByDate = (
    text,
    sortedResponse = mockSortedMessages,
    folderNumber = mockCustomFolderMetaResponse.data.attributes.folderId,
  ) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`);
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderNumber}/threads**`,
      sortedResponse,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find('.received-date')
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(listBefore.join(','));
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('.received-date')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(listAfter.join(','));
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };
}

export default new PatientMessageCustomFolderPage();
