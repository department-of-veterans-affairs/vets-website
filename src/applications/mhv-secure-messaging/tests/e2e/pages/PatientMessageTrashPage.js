import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockThreadResponse from '../fixtures/trashResponse/trash-thread-response.json';
import mockSingleMessageResponse from '../fixtures/trashResponse/trash-single-message-response.json';
import trashSearchResponse from '../fixtures/trashResponse/trash-search-response.json';
import { Locators, Paths } from '../utils/constants';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';

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

  inputFilterDataText = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  clickFilterMessagesButton = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/search`,
      trashSearchResponse,
    );
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
  };

  clickClearFilterButton = () => {
    this.inputFilterDataText('any');
    this.clickFilterMessagesButton();
    cy.get(Locators.CLEAR_FILTERS).click({ force: true });
  };

  clickSortMessagesByDateButton = (
    option = 'Oldest to newest',
    sortedResponse,
  ) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${option}`, { force: true });
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.SORT).click({ force: true });
  };

  verifySorting = (option, data) => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`Before sorting - ${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.clickSortMessagesByDateButton(option, data);
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            cy.log(`After sorting -${JSON.stringify(listAfter)}`);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
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

  verifyFilterResults = (filterValue, responseData = sentSearchResponse) => {
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

  verifyFilterResultsText = (
    filterValue,
    responseData = trashSearchResponse,
  ) => {
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

  inputFilterDataByKeyboard = text => {
    cy.tabToElement('#inputField')
      .first()
      .type(`${text}`, { force: true });
  };

  submitFilterByKeyboard = (mockFilterResponse, folderId) => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/search`,
      mockFilterResponse,
    ).as('filterResult');

    cy.realPress('Enter');
  };

  clearFilterByKeyboard = () => {
    // next line required to start tab navigation from the header of the page
    cy.get('[data-testid="folder-header"]').click();
    cy.contains('Clear Filters').then(el => {
      cy.tabToElement(el)
        .first()
        .click();
    });
  };

  sortMessagesByKeyboard = (text, data, folderId) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${text}`, { force: true });

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/threads**`,
      data,
    ).as('sortResponse');
    cy.tabToElement('[data-testid="sort-button"]');
    cy.realPress('Enter');
  };

  verifySortingByKeyboard = (text, data, folderId) => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.sortMessagesByKeyboard(`${text}`, data, folderId);
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting${JSON.stringify(listAfter)}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };
}

export default new PatientMessageTrashPage();
