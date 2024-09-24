import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
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
      meta: {
        ...mockFoldersResponse.meta,
        pagination: {
          ...mockFoldersResponse.meta.pagination,
          totalEntries: 7,
        },
      },
    };

    const updatedFolderWithThread = {
      ...createdFolderResponse,
      data: {
        ...createdFolderResponse.data,
        attributes: {
          ...createdFolderResponse.data.attributes,
          count: 1,
        },
      },
    };

    cy.log(JSON.stringify(updatedFolders));

    cy.intercept(
      `POST`,
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as(`createdFolderResponse`);
    cy.intercept(
      `GET`,
      `${Paths.SM_API_BASE}/folders?page=1&per_page=999&useCache=false`,
      updatedFolders,
    ).as(`updatedFoldersList`);
    cy.intercept(
      `PATCH`,
      `/my_health/v1/messaging/threads/7176615/move?folder_id=${
        createdFolderResponse.data.attributes.folderId
      }`,
      { statusCode: 204 },
    ).as(`threadNoContent`);

    cy.get(Locators.BUTTONS.MOVE_BUTTON_TEXT).click({ force: true });
    cy.contains(`Create new folder`).click();
    cy.get(Locators.BUTTONS.TEXT_CONFIRM).click();
    cy.get(`#inputField`).type(`folderWithRandomNumber`, { force: true });
    cy.get(`[data-testid="create-folder-button"]`).click();

    cy.log(JSON.stringify(updatedFolderWithThread));

    cy.intercept(
      `GET`,
      `/my_health/v1/messaging/folders/${
        createdFolderResponse.data.attributes.folderId
      }?useCache=false`,
      updatedFolderWithThread,
    ).as(`updatedFolder`);
    cy.intercept(
      `GET`,
      `/my_health/v1/messaging/folders/${
        createdFolderResponse.data.attributes.folderId
      }/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC`,
      mockThread,
    ).as(`updatedThread`);

    // cy.wait(2000)
    cy.get(`.sm-breadcrumb-list-item`).click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
