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

  loadFolders = () => {
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDER}`, mockFolders).as(
      'foldersResponse',
    );
    cy.get('[data-testid="folders-inner-nav"]>a').click({ force: true });
  };

  loadFolderMessages = (
    folderName,
    folderNumber,
    folderResponseIndex,
    messagesList = mockMessages,
  ) => {
    this.foldersSetup();
    this.loadFolders();
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}*`, {
      data: mockFolders.data[folderResponseIndex],
    }).as('folderMetaData');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}/threads*`,
      messagesList,
    ).as('folderThreadResponse');

    cy.get(`[data-testid=${folderName}]>a`).click({ force: true });
    cy.wait('@folderMetaData');
    cy.wait('@folderThreadResponse');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
  };

  loadInboxMessages = messagesList => {
    this.loadFolderMessages('Inbox', 0, 0, messagesList);
  };

  loadDraftMessages = messagesList => {
    this.loadFolderMessages('Drafts', -2, 1, messagesList);
  };

  loadSentMessages = messagesList => {
    this.loadFolderMessages('Sent', -1, 2, messagesList);
  };

  loadDeletedMessages = messagesList => {
    this.loadFolderMessages('Deleted', -3, 3, messagesList);
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
