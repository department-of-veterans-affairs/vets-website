import { Paths, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from './GeneralFunctionsPage';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockMessages from '../fixtures/threads-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';
import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockTrashFolderMetaResponse from '../fixtures/trashResponse/folder-deleted-metadata.json';
import mockCustomFolderMetaResponse from '../fixtures/customResponse/folder-custom-metadata.json';

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
          title: 'Service unavailable',
          code: '503',
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
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as('errorRecipients');

    cy.visit(Paths.UI_MAIN + Paths.COMPOSE);
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
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as(`inboxMessagesError`);

    cy.visit(Paths.UI_MAIN + Paths.INBOX);
    cy.wait('@inboxMessagesError', { requestTimeout: 10000 });
  };

  loadSentFolderThreads500Error = () => {
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
      errors: [
        {
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as('sentMessagesError');

    cy.visit(Paths.UI_MAIN + Paths.SENT);
    cy.wait('@sentMessagesError', { requestTimeout: 10000 });
  };

  loadDraftsFolderThreads500Error = () => {
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
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
      mockDraftFolderMetaResponse,
    ).as('draftFolderMetaData');

    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`, {
      errors: [
        {
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as('draftMessagesError');

    cy.visit(Paths.UI_MAIN + Paths.DRAFTS);
    cy.wait('@draftMessagesError', { requestTimeout: 10000 });
  };

  loadTrashFolderThreads500Error = () => {
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
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3*`,
      mockTrashFolderMetaResponse,
    ).as('trashFolderMetaData');

    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3/threads**`, {
      errors: [
        {
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as('trashMessagesError');

    cy.visit(Paths.UI_MAIN + Paths.DELETED);
    cy.wait('@trashMessagesError', { requestTimeout: 10000 });
  };

  loadCustomFolderThreads500Error = () => {
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
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/*`,
      mockCustomFolderMetaResponse,
    ).as('customFolderMetaData');

    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/*/threads**`, {
      errors: [
        {
          title: 'Service unavailable',
          code: '503',
          status: '503',
        },
      ],
    }).as('customFolderMessagesError');

    cy.visit(
      `${Paths.UI_MAIN + Paths.FOLDERS}/${
        mockCustomFolderMetaResponse.data.attributes.folderId
      }`,
    );
    cy.wait('@customFolderMessagesError', { requestTimeout: 10000 });
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

  verifyAttachmentErrorMessage = errormessage => {
    cy.get(Locators.ALERTS.ERROR_MESSAGE)
      .should('include.text', errormessage)
      .should('be.visible');
  };
}

export default new PatientErrorPage();
