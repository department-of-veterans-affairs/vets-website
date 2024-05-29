import mockMessages from '../fixtures/messages-response.json';
import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockToggles from '../fixtures/toggles-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import { Data, Assertions, Locators, Paths } from '../utils/constants';

class FolderLoadPage {
  foldersSetup = () => {
    cy.intercept('GET', Paths.INTERCEPT.FEATURE_TOGGLES, mockToggles).as(
      'featureToggle',
    );
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_CATEGORY, mockCategories).as(
      'categories',
    );
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER, mockFolders).as(
      'folders',
    );
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, mockMessages).as(
      'inboxMessages',
    );
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadFolderMessages = (folderName, folderNumber, folderResponseIndex) => {
    this.foldersSetup();
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}*`, {
      data: mockFolders.data[folderResponseIndex],
    }).as('folderMetaData');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}/threads*`,
      mockMessages,
    ).as('folderThreadResponse');

    cy.get(`[data-testid="${folderName}-sidebar"]`).click();
    cy.wait('@folderMetaData');
    cy.wait('@folderThreadResponse');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
  };

  loadInboxMessages = () => {
    this.loadFolderMessages('inbox', 0, 0);
  };

  loadDraftMessages = () => {
    this.loadFolderMessages('drafts', -2, 1);
  };

  loadSentMessages = () => {
    this.loadFolderMessages('sent', -1, 2);
  };

  loadDeletedMessages = () => {
    this.loadFolderMessages('trash', -3, 3);
  };

  verifyFolderHeaderText = text => {
    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('have.text', `${text}`);
  };

  verifyBackToMessagesButton = () => {
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_RECIPIENT, mockRecipients);
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_MESS, mockMessages);

    cy.contains(Data.BACK_TO_MSG)
      .should('be.visible')
      .click({ force: true });
    cy.get(Locators.HEADER).should('contain', Assertions.MESSAGES);
  };

  clickAndNavigateToLastPage = index => {
    cy.get(Locators.ALERTS.PAGIN_LIST)
      .eq(index)
      .click();
  };

  verifyPaginationElements = () => {
    cy.get(Locators.ALERTS.PAGIN_LIST).each(el => {
      cy.wrap(el).should('be.visible');
    });
  };
}

export default new FolderLoadPage();
