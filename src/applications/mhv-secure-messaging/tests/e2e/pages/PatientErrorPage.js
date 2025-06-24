import { Paths, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from './GeneralFunctionsPage';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import FolderLoadPage from './FolderLoadPage';

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

    cy.visit(Paths.UI_MAIN + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadRecipients500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.SENT_FOLDER_THREADS}/*`,
      mockSentMessages,
    ).as('folders');

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`, {
      errors: [
        {
          status: '503',
        },
      ],
    }).as('errorRecipients');

    cy.visit(Paths.UI_MAIN + Paths.COMPOSE, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadInboxFolderThreads500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, {
      statusCode: 503,
    }).as(`inboxMessages`);

    cy.intercept('GET', Paths.INTERCEPT.INBOX_FOLDER, mockInboxFolder).as(
      'inboxFolderMetaData',
    );

    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('recipients');

    cy.visit(Paths.UI_MAIN + Paths.INBOX);
    cy.wait('@inboxMessages', { requestTimeout: 10000 });
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

  verifyOnlyError500Content = () => {
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

  verifyError500Content = () => {
    cy.get(`va-alert`).should('be.focused');

    cy.findByTestId(`alert-heading`)
      .should(`be.visible`)
      .and(`have.text`, Data.ERROR_500.HEADER);

    cy.findByTestId(`alert-text`)
      .should(`be.visible`)
      .and(`include.text`, Data.ERROR_500.TEXT);
  };
}

export default new PatientErrorPage();
