import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
// import FolderManagementPage from './pages/FolderManagementPage';
import mockFoldersResponse from './fixtures/folder-response.json';
import mockThread from './fixtures/messages-response.json';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';

describe('Secure Messaging Move Message tests', () => {
  it(`move message from inbox to new folder`, () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadSingleThread();

    const updatedFolders = {
      ...mockFoldersResponse,
      data: [...mockFoldersResponse.data, createdFolderResponse.data],
    };

    const updatedFolderWithThread = {
      ...createdFolderResponse,
      data: {
        ...createdFolderResponse.data,
      },
    };

    cy.intercept(
      `POST`,
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as(`createdFolder`);
    cy.intercept(`GET`, `${Paths.SM_API_BASE}/folders*`, updatedFolders).as(
      `updatedFoldersList`,
    );
    cy.intercept(
      `PATCH`,
      `${Paths.SM_API_BASE}/threads/7176615/move?folder_id=${
        createdFolderResponse.data.attributes.folderId
      }`,
      { statusCode: 204 },
    ).as(`threadNoContent`);

    cy.get(Locators.BUTTONS.MOVE_BUTTON_TEXT).click({ force: true });
    cy.contains(`Create new folder`).click();
    cy.get(Locators.BUTTONS.TEXT_CONFIRM).click();
    cy.get(`#inputField`).type(createdFolderResponse.data.attributes.name, {
      force: true,
    });
    cy.get(Locators.BUTTONS.CREATE_FOLDER).click();

    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }*`,
      updatedFolderWithThread,
    ).as(`updatedFolder`);
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders/${
        createdFolderResponse.data.attributes.folderId
      }/threads*`,
      mockThread,
    ).as(`updatedThread`);

    // cy.wait(2000);

    cy.get(Locators.LINKS.CRUMBS_BACK).click();

    // focus assertion could not be executed due to successful alert stay on page  for 2000 ms

    GeneralFunctionsPage.verifyUrl(
      createdFolderResponse.data.attributes.folderId,
    );

    GeneralFunctionsPage.verifyPageHeader(
      createdFolderResponse.data.attributes.name,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
