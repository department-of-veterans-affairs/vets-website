import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockThreadResponse from '../fixtures/trashResponse/trash-thread-response.json';
import mockSingleMessageResponse from '../fixtures/trashResponse/trash-single-message-response.json';
import trashSearchResponse from '../fixtures/trashResponse/trash-search-response.json';
import mockSortedMessages from '../fixtures/trashResponse/sorted-trash-message-response.json';
import { Locators, Paths } from '../utils/constants';

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
    cy.get(Locators.FOLDERS.TRASH).click();
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

  inputFilterData = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  filterMessages = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/search`,
      trashSearchResponse,
    );
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
  };

  clearFilter = () => {
    this.inputFilterData('any');
    this.filterMessages();
    cy.get(Locators.CLEAR_FILTERS).click({ force: true });
  };

  sortMessagesByDate = (text, sortedResponse = mockSortedMessages) => {
    cy.get(Locators.DROPDOWN)
      .shadow()
      .find('#select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.BUTTON_SORT).click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(JSON.stringify(listBefore));
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            cy.log(JSON.stringify(listAfter));
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifyFolderHeader = text => {
    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('have.text', `${text}`);
  };

  // method below could not be used in filtered list due to different tag ([data-testid="message-list-item"])
  verifyResponseBodyLength = (responseData = mockTrashMessages) => {
    cy.get(Locators.THREADS).should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  verifyFilterResults = (filterValue, responseData = trashSearchResponse) => {
    cy.get(Locators.MESSAGES).should(
      'have.length',
      `${responseData.data.length}`,
    );

    cy.get(Locators.ALERTS.HIGHLIGHTED).each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          const lowerCaseText = text.toLowerCase();
          expect(lowerCaseText).to.contain(`${filterValue}`);
        });
    });
  };

  verifyFilterFieldCleared = () => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };
}

export default new PatientMessageTrashPage();
