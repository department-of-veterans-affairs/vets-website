import mockCustomResponse from '../fixtures/custom-response.json';
import defaultMockThread from '../fixtures/thread-response.json';
import { Data, Locators, Alerts, Paths } from '../utils/constants';
import createdFolderResponse from '../fixtures/customResponse/created-folder-response.json';
import SharedComponents from './SharedComponents';

class FolderManagementPage {
  currentThread = defaultMockThread;

  createANewFolderButton = () => {
    return cy
      .findByTestId(Locators.BUTTONS.CREATE_NEW_FOLDER_DATA_TEST_ID)
      .shadow()
      .find('[type="button"]');
  };

  clickDeleteFolderButton = () => {
    cy.findByTestId(Locators.BUTTONS.DELETE_FOLDER_DATA_TEST_ID).click();
  };

  editFolderNameButton = () => {
    return cy.findByTestId(Locators.BUTTONS.EDIT_FOLDER_DATA_TEST_ID);
  };

  createFolderTextBox = () => {
    return cy
      .findByTestId(Locators.FIELDS.FOLDER_NAME_DATA_TEST_ID)
      .shadow()
      .find('[name="folder-name"]');
  };

  createFolderModalButton = () => {
    return cy
      .findByTestId(Locators.BUTTONS.CREATE_FOLDER_DATA_TEST_ID)
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
    return cy.findByTestId('alert-text');
  };

  createFolderSuccessAlert = () => {
    return cy.findByTestId(Locators.ALERTS.CREATE_FOLDER_SUCCESS_DATA_TEST_ID);
  };

  verifyCreateFolderSuccessMessage = () => {
    this.createFolderSuccessAlert()
      .should('be.visible')
      .and('contain.text', Data.FOLDER_CREATED_SUCCESSFULLY);
  };

  verifyCreateFolderSuccessMessageHasFocus = () => {
    cy.findByTestId(Locators.BUTTONS.CREATE_NEW_FOLDER_DATA_TEST_ID).should(
      'have.focus',
    );
  };

  verifyDeleteSuccessMessageText = () => {
    this.folderConfirmation().should(
      'contain.text',
      Data.FOLDER_REMOVED_SUCCESSFULLY,
    );
  };

  verifyDeleteSuccessMessageHasFocus = () => {
    // Per MHV accessibility decision records, focus goes to H1
    cy.findByRole('heading', { level: 1 }).should('have.focus');
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
    // Per MHV accessibility decision records, focus goes to H1
    cy.findByRole('heading', { level: 1 }).should('have.focus');
  };

  verifyFolderInList = assertion => {
    const folderName = createdFolderResponse.data.attributes.name;
    if (assertion === 'eq') {
      cy.findByTestId(folderName).should('exist');
    } else {
      cy.findByTestId(folderName).should('not.exist');
    }
  };

  selectFolderFromModal = (folderName = `Trash`) => {
    cy.wait('@folders');

    cy.findByTestId(Locators.BUTTONS.MOVE_BUTTON_TEST_ID)
      .should('be.visible')
      .scrollIntoView();
    cy.findByTestId(Locators.BUTTONS.MOVE_BUTTON_TEST_ID).click({
      force: true,
      waitForAnimations: true,
    });

    cy.findByTestId(Locators.BUTTONS.MOVE_MODAL_TEST_ID)
      .should('be.visible')
      .then(() => {
        cy.findByLabelText(folderName).click();
      });
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
    cy.findByTestId(Locators.BUTTONS.MOVE_MODAL_TEST_ID).within(() => {
      cy.get(Locators.BUTTONS.TEXT_CONFIRM).click();
    });
  };

  moveMessageToNewFolder = foldersList => {
    cy.intercept(
      `POST`,
      Paths.INTERCEPT.MESSAGE_FOLDERS,
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

    cy.findByTestId(Locators.BUTTONS.MOVE_MODAL_TEST_ID).within(() => {
      cy.get(Locators.BUTTONS.TEXT_CONFIRM).click();
    });
    cy.fillVaTextInput(
      Locators.FIELDS.FOLDER_NAME_DATA_TEST_ID,
      createdFolderResponse.data.attributes.name,
    );
    cy.findByTestId(Locators.BUTTONS.CREATE_FOLDER_DATA_TEST_ID).click();
    cy.findByText('Folder was successfully created.').should('be.visible');
    // Per MHV accessibility decision records, focus goes to H1
    cy.findByRole('heading', { level: 1 }).should('have.focus');
  };

  backToInbox = () => {
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }?useCache=false`,
      createdFolderResponse,
    ).as(`folderDetail`);
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }/threads*`,
      defaultMockThread,
    ).as(`updatedFolder`);

    SharedComponents.clickBackBreadcrumb();
  };

  verifyMoveMessageSuccessConfirmationMessage = () => {
    cy.findByTestId('alert-text')
      .should('exist')
      .and('contain.text', 'Message conversation was successfully moved.');
  };

  verifyMoveMessageSuccessConfirmationHasFocus = () => {
    // Per MHV accessibility decision records, focus should go to H1, not alert.
    // Alert content is announced via role="status" without stealing focus.
    cy.findByRole('heading', { level: 1 }).should('have.focus');
  };
}

export default new FolderManagementPage();
