import mockCustomResponse from '../fixtures/custom-response.json';
import defaultMockThread from '../fixtures/thread-response.json';
import { Data, Locators, Alerts, Paths } from '../utils/constants';
import createdFolderResponse from '../fixtures/customResponse/created-folder-response.json';

class FolderManagementPage {
  currentThread = defaultMockThread;

  createANewFolderButton = () => {
    return cy
      .get(Locators.ALERTS.CREAT_NEW_TEXT_FOLD)
      .shadow()
      .find('[type="button"]');
  };

  clickDeleteFolderButton = () => {
    cy.get(Locators.BUTTONS.DELETE_FOLDER).click();
  };

  editFolderNameButton = () => {
    return cy.get(Locators.BUTTONS.EDIT_FOLDER);
  };

  createFolderTextBox = () => {
    return cy
      .get('[name="folder-name"]')
      .shadow()
      .find('[name="folder-name"]');
  };

  createFolderModalButton = () => {
    return cy
      .get('[text="Create"]')
      .shadow()
      .find('[type="button"]');
  };

  clickAndLoadCustomFolder = (
    folderName,
    folderId,
    folderData,
    folderMessages,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}*`,
      folderData,
    ).as('customFolderID');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/threads*`,
      folderMessages,
    ).as('customFolderMessages');

    cy.contains(folderName).click();
    cy.wait('@customFolderMessages');
  };

  folderConfirmation = () => {
    return cy.get('[data-testid="alert-text"]');
  };

  verifyDeleteSuccessMessageText = () => {
    this.folderConfirmation().should(
      'contain.text',
      Data.FOLDER_REMOVED_SUCCESSFULLY,
    );
  };

  verifyDeleteSuccessMessageHasFocus = () => {
    cy.get('[close-btn-aria-label="Close notification"]').should('have.focus');
  };

  verifyCreateFolderNetworkFailureMessage = () => {
    this.folderConfirmation()
      .should('be.visible')
      .and('contain.text', Alerts.OUTAGE);
  };

  verifyFolderActionMessage = text => {
    this.folderConfirmation().should('contain.text', text);
  };

  verifyFolderActionMessageHasFocus = () => {
    cy.get('[close-btn-aria-label*="Close notification"]').should('have.focus');
  };

  verifyFolderInList = assertion => {
    cy.get(`.folder-link`)
      .last()
      .invoke(`attr`, `data-testid`)
      .should(`${assertion}`, createdFolderResponse.data.attributes.name);
  };

  selectFolderFromModal = (folderName = `Deleted`) => {
    cy.get(Locators.BUTTONS.MOVE_BUTTON_TEXT).click();
    cy.get(`#radiobutton-${folderName}`).click();
  };

  confirmMovingMessageToFolder = (
    mockResponse = mockCustomResponse,
    folderId = `-3`,
  ) => {
    cy.intercept(
      'PATCH',
      `${Paths.INTERCEPT.MESSAGE_THREADS +
        mockResponse.data.attributes.threadId}/move?folder_id=${folderId}`,
      { statusCode: 204 },
    ).as('threadNoContent');
    cy.get(Locators.ALERTS.MOVE_MODAL)
      .find(Locators.BUTTONS.TEXT_CONFIRM)
      .click();
  };

  moveMessageToNewFolder = foldersList => {
    cy.intercept(
      `POST`,
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as(`createdFolder`);
    cy.intercept(`GET`, `${Paths.SM_API_BASE}/folders*`, foldersList).as(
      `updatedFoldersList`,
    );
    cy.intercept(
      `PATCH`,
      `${Paths.SM_API_BASE}/threads/7176615/move?folder_id=${
        createdFolderResponse.data.attributes.folderId
      }`,
      { statusCode: 204 },
    ).as(`threadNoContent`);

    cy.get(Locators.BUTTONS.TEXT_CONFIRM).click();
    cy.get(`#inputField`).type(createdFolderResponse.data.attributes.name, {
      force: true,
    });
    cy.get(Locators.BUTTONS.CREATE_FOLDER).click();
  };

  backToCreatedFolder = threadData => {
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }*`,
      createdFolderResponse,
    ).as(`updatedFolder`);
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }/threads*`,
      threadData,
    ).as(`updatedThread`);

    cy.get(Locators.LINKS.CRUMBS_BACK).then(btn => {
      return new Cypress.Promise(resolve => {
        setTimeout(resolve, 2000);
        cy.wrap(btn).click();
      });
    });
  };

  verifyMoveMessageSuccessConfirmationMessage = () => {
    cy.get('[data-testid="alert-text"]')
      .should('exist')
      .and('contain.text', 'Message conversation was successfully moved.');
  };

  verifyMoveMessageSuccessConfirmationHasFocus = () => {
    cy.get(Locators.ALERTS.CLOSE_NOTIFICATION).should('have.focus');
  };
}

export default new FolderManagementPage();
