import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockThreadResponse from '../fixtures/trashResponse/trash-thread-response.json';
import mockSingleMessageResponse from '../fixtures/trashResponse/trash-single-message-response.json';
import trashSearchResponse from '../fixtures/trashResponse/trash-search-response.json';
import mockSortedMessages from '../fixtures/trashResponse/sorted-trash-message-response.json';

class PatientMessageTrashPage {
  loadMessages = (mockMessagesResponse = mockTrashMessages) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3*',
      mockTrashFolderMetaResponse,
    ).as('trashFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/threads**',
      mockMessagesResponse,
    ).as('trashFolderMessages');
    cy.get('[data-testid="trash-sidebar"]').click();
    cy.wait('@trashFolder');
    cy.wait('@trashFolderMessages');
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

  inputFilterData = text => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  filterMessages = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-3/search',
      trashSearchResponse,
    );
    cy.get('[data-testid="filter-messages-button"]').click({ force: true });
  };

  clearFilter = () => {
    this.inputFilterData('any');
    this.filterMessages();
    cy.get('[text="Clear Filters"]').click({ force: true });
  };

  sortMessagesByDate = (text, sortedResponse = mockSortedMessages) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/threads**',
      sortedResponse,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find('[data-testid="received-date"]')
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(JSON.stringify(listBefore));
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('[data-testid="received-date"]')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            cy.log(JSON.stringify(listAfter));
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifyFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };

  // method below could not be used in filtered list due to different tag ([data-testid="message-list-item"])
  verifyResponseBodyLength = (responseData = mockTrashMessages) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  verifyFilterResults = (filterValue, responseData = trashSearchResponse) => {
    cy.get('[data-testid="message-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );

    cy.get('[data-testid="highlighted-text"]').each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          const lowerCaseText = text.toLowerCase();
          expect(lowerCaseText).to.contain(`${filterValue}`);
        });
    });
  };

  verifyFilterFieldCleared = () => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };
}

export default new PatientMessageTrashPage();
