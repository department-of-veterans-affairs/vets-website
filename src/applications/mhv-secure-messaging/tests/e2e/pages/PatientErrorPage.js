import { Paths, Alerts, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from './GeneralFunctionsPage';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockSentFolderMetaResponse from '../fixtures/sentResponse/folder-sent-metadata.json';
import FolderLoadPage from './FolderLoadPage';

class PatientErrorPage {
  loadParticularFolderError = () => {
    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('recipients');

    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/*`, {
      errors: [
        {
          title: 'Service unavailable',
          detail: Alerts.OUTAGE,
          status: '503',
        },
      ],
    }).as('folderMetaData');

    cy.visit(Paths.UI_MAIN + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadMyFoldersError = () => {
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}*`, {
      errors: [
        {
          title: 'Service unavailable',
          detail: Alerts.OUTAGE,
          status: '503',
        },
      ],
    }).as('folders');

    cy.visit(Paths.UI_MAIN + Paths.FOLDERS, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadInboxFolder500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, {
      statusCode: 500,
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

    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages', { requestTimeout: 10000 });
  };

  loadSentFolder500Error = () => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`,
      mockSentFolderMetaResponse,
    ).as('sentFolder');

    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1/threads**`, {
      statusCode: 500,
    }).as('sentFolderMessages');

    cy.get('[data-testid="sent-inner-nav"]>a').click({ force: true });
  };

  loadCustomFolder500Error = () => {
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
      { statusCode: 500 },
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

  verifyAlertMessageText = () => {
    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Alerts.OUTAGE);
  };

  verifyFromToDateErrorMessageText = (index, text) => {
    cy.get(Locators.FROM_TO_DATES_CONTAINER)
      .find('#error-message')
      .eq(index)
      .scrollIntoView()
      .should('contain.text', text);
  };

  verifyPageNotFoundContent = () => {
    GeneralFunctionsPage.verifyPageHeader(`Page not found`);
    cy.get(`h2`)
      .should(`be.visible`)
      .and(`include.text`, Data.NOT_FOUND.H2);

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
      .and(`have.attr`, `text`, Data.NOT_FOUND.LINK_0);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`va-link`)
      .eq(1)
      .should(`be.visible`)
      .and(
        `have.attr`,
        `href`,
        `https://eauth.va.gov/MAP/users/v2/landing?redirect_uri=/cirrusmd/`,
      )
      .and(`have.attr`, `text`, Data.NOT_FOUND.LINK_1);

    cy.findByTestId(Locators.PAGE_NOT_FOUND)
      .find(`va-link`)
      .eq(2)
      .should(`be.visible`)
      .and(`have.attr`, `href`, `/find-locations`)
      .and(`have.attr`, `text`, Data.NOT_FOUND.LINK_2);
  };

  verifyError500Content = () => {
    cy.get(`va-alert`).should('be.focused');

    cy.findByTestId(`alert-heading`)
      .should(`be.visible`)
      .and(`have.text`, Data.ERROR_500.HEADER);

    cy.findByTestId(`alert-text`)
      .should(`be.visible`)
      .and(`have.text`, Data.ERROR_500.TEXT);
  };
}

export default new PatientErrorPage();
