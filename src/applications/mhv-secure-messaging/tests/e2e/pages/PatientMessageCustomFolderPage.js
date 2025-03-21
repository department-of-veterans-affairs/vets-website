import mockCustomFolderMessages from '../fixtures/customResponse/custom-folder-messages-response.json';
import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';
import mockSortedMessages from '../fixtures/customResponse/sorted-custom-folder-messages-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { Paths, Locators, Data, Assertions } from '../utils/constants';
import createdFolderResponse from '../fixtures/customResponse/created-folder-response.json';
import customSearchResponse from '../fixtures/customResponse/custom-search-response.json';
import FolderLoadPage from './FolderLoadPage';

class PatientMessageCustomFolderPage {
  folder = mockFolders.data[mockFolders.data.length - 1];

  folderId = mockFolders.data[mockFolders.data.length - 1].attributes.folderId;

  folderName = mockFolders.data[mockFolders.data.length - 1].attributes.name;

  loadFoldersList = (foldersList = mockFolders) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      foldersList,
    ).as('customFoldersList');
    cy.get(Locators.FOLDERS_LIST).click();
    cy.wait('@customFoldersList');
  };

  loadCustomFolderWithNoMessages = () => {
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }*`,
      createdFolderResponse,
    ).as(`loadedFolderResponse`);

    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }/threads*`,
      { data: [] },
    ).as(`emptyFolderThread`);

    cy.get(
      `[data-testid = ${createdFolderResponse.data.attributes.name}]>a`,
    ).click();
  };

  loadSingleFolderWithMessages = (folderId, folderName) => {
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}?*`, {
      data: {
        id: `${folderId}`,
        type: 'folders',
        attributes: {
          folderId,
          name: folderName,
          count: 0,
          unreadCount: 0,
          systemFolder: false,
        },
        links: {
          self:
            'https://staging-api.va.gov/my_health/v1/messaging/folders/3041238',
        },
      },
    }).as('singleFolder');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/threads?*`,
      mockSingleThreadResponse,
    ).as('singleFolderThread');

    cy.contains(folderName).click({ waitForAnimations: true });
    cy.wait('@singleFolder');
    cy.wait('@singleFolderThread');
  };

  loadMessages = (
    threadResponse = mockSingleThreadResponse,
    folderName = this.folderName,
    folderId = this.folderId,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${this.folderId}*`,
      {
        data: this.folder,
      },
    ).as('customFolder');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/threads*`,
      threadResponse,
    ).as('customFolderThread');
    FolderLoadPage.loadFolders();

    cy.get(`[data-testid=${folderName}]`).click({ force: true });

    cy.visit(`${Paths.UI_MAIN + Paths.FOLDERS}/${folderId}`, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadDetailedMessage = (detailedMessage = mockSingleMessageResponse) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }/thread`,
      mockSingleThreadResponse,
    ).as('threadResponse');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        detailedMessage.data.attributes.messageId
      }`,
      mockSingleMessageResponse,
    ).as('detailedMessage');

    cy.get('[data-testid="thread-list-item"]')
      .first()
      .click();
  };

  verifyFolderHeaderText = (text = this.folderName) => {
    cy.get('[data-testid="edit-folder-button"]')
      .should('be.visible')
      .then(() => {
        cy.get(Locators.HEADER).should('have.text', `${text}`);
      });
  };

  verifyResponseBodyLength = (responseData = mockCustomFolderMessages) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );
  };

  clickSortMessagesByDateButton = (
    text,
    sortedResponse = mockSortedMessages,
    folderId = this.folderId,
  ) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${text}`);
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.SORT).click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting: ${listBefore.join(',')}`);
      })
      .then(() => {
        this.clickSortMessagesByDateButton('Oldest to newest');
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting: ${listAfter.join(',')}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifyMainButtons = () => {
    cy.get(Locators.BUTTONS.EDIT_FOLDER)
      .should('be.visible')
      .and('have.text', `Edit folder name`);
    cy.get(Locators.BUTTONS.REMOVE_FOLDER)
      .should('be.visible')
      .and('have.text', `Remove folder`);
    cy.get(Locators.BUTTONS.SORT)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and('contain.text', `Sort`);
    cy.get(Locators.BUTTONS.FILTER).contains('Filter');
  };

  inputFilterDataText = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  clickFilterMessagesButton = (folderId = this.folderId) => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/search`,
      customSearchResponse,
    );
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
  };

  verifyFilterResultsText = (
    filterValue,
    responseData = customSearchResponse,
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
          expect(lowerCaseText).to.contain(`test`);
        });
    });
  };

  clickClearFilterButton = () => {
    cy.get(Locators.CLEAR_FILTERS).click({ force: true });
  };

  verifyFilterFieldCleared = () => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };

  createCustomFolder = (
    updatedFoldersResponse,
    folderName = createdFolderResponse.data.attributes.name,
  ) => {
    cy.get(Locators.ALERTS.CREATE_NEW_FOLDER).click();
    cy.get('[name="folder-name"]')
      .shadow()
      .find('input')
      .type(folderName);

    cy.intercept(
      `POST`,
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as(`createdFolderResponse`);

    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      updatedFoldersResponse,
    ).as(`updatedFoldersList`);

    cy.get('[text="Create"]')
      .shadow()
      .find('[type="button"]')
      .click();
  };

  deleteCustomFolder = () => {
    cy.intercept(
      'DELETE',
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }`,
      {
        statusCode: 204,
      },
    ).as('deletedFolderResponse');

    cy.intercept('GET', `${Paths.SM_API_BASE}/folders*`, mockFolders).as(
      'updatedFoldersList',
    );

    cy.get(Locators.FOLDERS.FOLDER_REMOVE)
      .shadow()
      .find('[type="button"]')
      .click();
  };

  deleteParticularCustomFolder = (folderId, updatedFoldersResponse) => {
    cy.intercept('DELETE', `${Paths.SM_API_BASE}/folders/${folderId}`, {
      statusCode: 204,
    }).as('deletedFolderResponse');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/folders*`,
      updatedFoldersResponse,
    ).as('updatedFoldersList');

    cy.get(Locators.ALERTS.REMOVE_THIS_FOLDER)
      .find(`va-button[text*='remove']`)
      .click();
  };

  editFolderButton = () => {
    return cy.get(Locators.BUTTONS.EDIT_FOLDER);
  };

  submitEditFolderName = folderName => {
    cy.get('[name="new-folder-name"]')
      .should('be.visible')
      .shadow()
      .find('[id="inputField"]')
      .should('be.visible')
      .type(folderName, { force: true });

    cy.intercept('PUT', `/my_health/v1/messaging/folders/${this.folderId}`, {
      data: {
        id: '2556251',
        type: 'folders',
        attributes: {
          folderId: 2556251,
          name: folderName,
          count: 0,
          unreadCount: 0,
          systemFolder: false,
        },
        links: {
          self:
            'https://staging-api.va.gov/my_health/v1/messaging/folders/2556251',
        },
      },
    }).as('updatedFolderName');

    cy.get('[text="Save"]')
      .should('be.visible')
      .click();
  };

  verifyRemoveFolderButton = () => {
    cy.get(Locators.BUTTONS.REMOVE_FOLDER)
      .should('be.visible')
      .and('have.text', Data.REMOVE_FOLDER);
  };

  tabAndPressToRemoveFolderButton = () => {
    cy.tabToElement(Locators.BUTTONS.REMOVE_FOLDER).should(
      'have.text',
      Data.REMOVE_FOLDER,
    );

    cy.realPress('Enter');
  };

  verifyEmptyFolderAlert = () => {
    cy.get(Locators.ALERTS.HEADER).should(
      'have.text',
      Assertions.EMPTY_THIS_FOLDER,
    );
    cy.contains(Data.CANNOT_REMOVE_FOLDER).should('be.visible');
    cy.contains('button', 'Ok');
  };

  clickOnCloseIcon = () => {
    cy.get(Locators.FOLDERS.FOLDER_NOT_EMPTY)
      .shadow()
      .find('button')
      .eq(0)
      .click();
  };

  verifyFocusOnRemoveFolderButton = () => {
    cy.get(Locators.BUTTONS.REMOVE_FOLDER)
      .should('be.visible')
      .then(() => {
        cy.get(Locators.BUTTONS.REMOVE_FOLDER).should('have.focus');
      });
  };

  inputFilterDataByKeyboard = text => {
    cy.tabToElement('#inputField')
      .first()
      .type(`${text}`, { force: true });
  };

  submitFilterByKeyboard = (mockFilterResponse, folderId = this.folderId) => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/search`,
      mockFilterResponse,
    ).as('filterResult');

    cy.realPress('Enter');
  };

  verifyFilterResults = (filterValue, responseData) => {
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

  clearFilterByKeyboard = () => {
    // next line required to start tab navigation from the header of the page
    cy.get('[data-testid="folder-header"]').click();
    cy.contains('Clear Filters').then(el => {
      cy.tabToElement(el)
        .first()
        .click();
    });
  };

  sortMessagesByKeyboard = (text, data, folderId = this.folderId) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${text}`, { force: true });

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/threads**`,
      data,
    );
    cy.tabToElement('[data-testid="sort-button"]');
    cy.realPress('Enter');
  };

  verifySortingByKeyboard = (text, data, folderId = this.folderId) => {
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

export default new PatientMessageCustomFolderPage();
