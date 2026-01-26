import mockSingleMessageResponse from '../fixtures/customResponse/custom-single-message-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockSingleThreadResponse from '../fixtures/customResponse/custom-single-thread-response.json';
import { Paths, Locators, Data, Assertions } from '../utils/constants';
import createdFolderResponse from '../fixtures/customResponse/created-folder-response.json';
import mockThreadsResponse from '../fixtures/threads-response.json';
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
      mockThreadsResponse,
    ).as('singleFolderThread');

    cy.contains(folderName).click({ waitForAnimations: true });
    cy.wait('@singleFolder');
    cy.wait('@singleFolderThread');
  };

  loadMessages = (
    threadResponse = mockThreadsResponse,
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

    cy.wait(`@customFolderThread`);
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
        cy.get(Locators.HEADER).should('have.text', `Messages: ${text}`);
      });
  };

  verifyResponseBodyLength = (responseData = mockThreadsResponse) => {
    cy.get('[data-testid="thread-list-item"]').should(
      'have.length',
      responseData.data.length,
    );
  };

  verifyMainButtons = () => {
    cy.get(Locators.BUTTONS.EDIT_FOLDER)
      .should('be.visible')
      .and('have.attr', 'text', 'Edit folder name');
    cy.get(Locators.BUTTONS.REMOVE_FOLDER)
      .should('be.visible')
      .and('have.attr', 'text', 'Remove folder');
    cy.get(Locators.BUTTONS.SORT)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and('contain.text', `Sort`);
    cy.get(Locators.BUTTONS.FILTER).contains('filter');
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

    cy.findByTestId(Locators.FOLDERS.FOLDER_REMOVE_DATA_TEST_ID).click({
      force: true,
    });
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
    // Wait for the edit form to be visible
    cy.findByTestId('edit-folder-form').should('be.visible');

    // Use the fillVaTextInput command for proper web component interaction
    cy.fillVaTextInput('new-folder-name', folderName);

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

    cy.findByTestId('save-edit-folder-button')
      .should('be.visible')
      .click();
  };

  verifyRemoveFolderButton = () => {
    cy.get(Locators.BUTTONS.REMOVE_FOLDER)
      .should('be.visible')
      .and('have.attr', 'text', Data.REMOVE_FOLDER);
  };

  clickRemoveFolderButton = () => {
    cy.get(Locators.BUTTONS.REMOVE_FOLDER).should(
      'have.attr',
      'text',
      Data.REMOVE_FOLDER,
    );
    cy.get(Locators.BUTTONS.REMOVE_FOLDER).click({ waitForAnimations: true });
  };

  verifyEmptyFolderAlert = () => {
    cy.get(Locators.ALERTS.HEADER)
      .find(`#heading`)
      .should('have.text', Assertions.EMPTY_THIS_FOLDER);
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
}

export default new PatientMessageCustomFolderPage();
