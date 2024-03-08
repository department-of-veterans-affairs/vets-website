import mockCustomFolderMessages from '../fixtures/customResponse/custom-folder-messages-response.json';
import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';
import mockSortedMessages from '../fixtures/customResponse/sorted-custom-folder-messages-response.json';
import mockFolders from '../fixtures/generalResponses/folders.json';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { Paths, Locators } from '../utils/constants';
import createdFolderResponse from '../fixtures/customResponse/created-folder-response.json';
import mockFolderWithoutMessages from '../fixtures/customResponse/folder-no-messages-response.json';
import mockFolderWithMessages from '../fixtures/customResponse/folder-messages-response .json';

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

  loadSingleFolderWithNoMessages = (folderId, folderName) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}?*`,
      createdFolderResponse,
    ).as('singleFolder');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/threads?*`,
      mockFolderWithoutMessages,
    ).as('singleFolderThread');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      mockFolderWithoutMessages,
    ).as('inboxFolderWithNoMessage');

    cy.contains(folderName).click({ waitForAnimations: true });
    cy.wait('@singleFolder');
    cy.wait('@singleFolderThread');
    cy.wait('@inboxFolderWithNoMessage');
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
      mockFolderWithMessages,
    ).as('singleFolderThread');

    cy.contains(folderName).click({ waitForAnimations: true });
    cy.wait('@singleFolder');
    cy.wait('@singleFolderThread');
  };

  loadMessages = (folderName = this.folderName, folderId = this.folderId) => {
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
      mockSingleThreadResponse,
    ).as('customFolderThread');

    cy.get(`[data-testid=${folderName}]`).click();

    cy.visit(`${Paths.UI_MAIN + Paths.FOLDERS}/${folderId}`, {
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

  sortMessagesByDate = (
    text,
    sortedResponse = mockSortedMessages,
    folderId = this.folderId,
  ) => {
    cy.get(Locators.DROPDOWN)
      .shadow()
      .find('#select')
      .select(`${text}`);
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.BUTTON_SORT).click({ force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting: ${listBefore.join(',')}`);
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting: ${listAfter.join(',')}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  VerifyFilterBtnExist = () => {
    cy.get(Locators.BUTTONS.FILTER).contains('Filter');
  };

  createCustomFolder = folderName => {
    mockFolders.data.push(createdFolderResponse.data);
    cy.get(Locators.ALERTS.CREATE_NEW_FOLDER).click();
    cy.get('[name="folder-name"]')
      .shadow()
      .find('[name="folder-name"]')
      .type(folderName);

    cy.intercept(
      'POST',
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as('createFolder');
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}?*`,
      mockFolders,
    ).as('updatedFoldersList');

    cy.get('[text="Create"]')
      .shadow()
      .find('[type="button"]')
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
}

export default new PatientMessageCustomFolderPage();
