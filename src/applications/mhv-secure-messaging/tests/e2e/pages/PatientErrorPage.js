import { Paths, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from './GeneralFunctionsPage';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import FolderLoadPage from './FolderLoadPage';
import mockMessages from '../fixtures/threads-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';

class PatientErrorPage {
  loadFolders500Error = () => {
    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('recipients');

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/*`, {
      errors: [
        {
          status: '503',
        },
      ],
    }).as('errorFolders');

    cy.visit(Paths.UI_MAIN + Paths.INBOX);
  };

  loadRecipients500Error = () => {
    cy.intercept('GET', Paths.INTERCEPT.INBOX_FOLDER, mockInboxFolder).as(
      'inboxFolderMetaData',
    );

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, mockMessages).as(
      'inboxMessages',
    );

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`, {
      errors: [
        {
          status: '503',
        },
      ],
    }).as('errorRecipients');

    cy.visit(Paths.UI_MAIN + Paths.INBOX);
  };

  loadInboxFolderThreads500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');

    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('recipients');

    cy.intercept('GET', Paths.INTERCEPT.INBOX_FOLDER, mockInboxFolder).as(
      'inboxFolderMetaData',
    );

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, {
      errors: [
        {
          status: '503',
        },
      ],
    }).as(`inboxMessagesError`);

    cy.visit(Paths.UI_MAIN + Paths.INBOX);
    cy.wait('@inboxMessagesError', { requestTimeout: 10000 });
  };

  loadSentFolder500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');

    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('recipients');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`,
      mockSentFolderMetaResponse,
    ).as('sentFolderMetaData');

    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1/threads**`, {
      statusCode: 500,
    }).as('sentMessagesError');

    cy.visit(Paths.UI_MAIN + Paths.SENT);
    cy.wait('@sentMessagesError', { requestTimeout: 10000 });
  };

  loadCustomFolderThreads500Error = () => {
    const folder = mockFolders.data[mockFolders.data.length - 1];
    const { folderId } = mockFolders.data[
      mockFolders.data.length - 1
    ].attributes;
    const folderName =
      mockFolders.data[mockFolders.data.length - 1].attributes.name;

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}*`, {
      data: folder,
    }).as('customFolder');

    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/threads*`,
      { statusCode: 503 },
    ).as('customFolderThread');
    FolderLoadPage.loadFolders();

    cy.get(`[data-testid=${folderName}]`).click({ force: true });

    cy.visit(`${Paths.UI_MAIN + Paths.FOLDERS}/${folderId}`);

    cy.wait(`@customFolderThread`);
  };

  verifyPageNotFoundContent = () => {
    GeneralFunctionsPage.verifyPageHeader(`Page not found`);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`p`)
      .eq(0)
      .should(`be.visible`)
      .and(`include.text`, Data.NOT_FOUND.P_O);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`p`)
      .eq(1)
      .should(`be.visible`)
      .and(`include.text`, Data.NOT_FOUND.P_1);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`va-link`)
      .eq(0)
      .should(`be.visible`)
      .and(`have.attr`, `href`, `/my-health`)
      .and(`have.attr`, `text`, Data.NOT_FOUND.LINK);
  };

  verifyError500Content = () => {
    cy.get(`va-alert`).should('be.focused');

    cy.findByTestId(`alert-heading`)
      .should(`be.visible`)
      .and(`have.text`, Data.ERROR_500.HEADER);

    cy.findByTestId(`alert-text`)
      .should(`be.visible`)
      .and(`include.text`, Data.ERROR_500.TEXT);

    cy.findByTestId(`folder-header`).should(`not.exist`);
    cy.findByTestId(`inbox-footer`).should(`not.exist`);
  };
}

export default new PatientErrorPage();
