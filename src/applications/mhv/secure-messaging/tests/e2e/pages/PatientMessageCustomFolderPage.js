import mockCustomFolderMessages from '../fixtures/customResponse/custom-folder-messages-response.json';
import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';
import mockSortedMessages from '../fixtures/customResponse/sorted-custom-folder-messages-response.json';
import mockFolders from '../fixtures/generalResponses/folders.json';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { Paths, Locators } from '../utils/constants';

class PatientMessageCustomFolderPage {
  folder = mockFolders.data[mockFolders.data.length - 1];

  folderId = mockFolders.data[mockFolders.data.length - 1].attributes.folderId;

  folderName = mockFolders.data[mockFolders.data.length - 1].attributes.name;

  loadFoldersList = () => {
    cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
      'customFoldersList',
    );
    cy.get('[data-testid="my-folders-sidebar"]').click();
  };

  loadMessages = () => {
    cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
      'customFoldersList',
    );

    cy.intercept('GET', `/my_health/v1/messaging/folders/${this.folderId}*`, {
      data: this.folder,
    }).as('customFolder');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${this.folderId}/threads*`,
      mockSingleThreadResponse,
    ).as('customFolderThread');

    cy.get(`[data-testid=${this.folderName}]`).click();

    cy.visit(`${Paths.UI_MAIN + Paths.FOLDERS}/${this.folderId}`, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockSingleThreadResponse,
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

  verifyFolderHeader = (text = this.folderName) => {
    cy.get(Locators.HEADER).should('have.text', `${text}`);
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
    folderId = this.folderId,
  ) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`);
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads**`,
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
        cy.log(`List before sorting: ${listBefore.join(',')}`);
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('.received-date')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting: ${listAfter.join(',')}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  VerifyFilterBtnExist = () => {
    cy.get('[data-testid="filter-messages-button"]').contains('Filter');
  };
}

export default new PatientMessageCustomFolderPage();
