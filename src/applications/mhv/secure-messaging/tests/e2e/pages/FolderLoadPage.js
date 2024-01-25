import mockMessages from '../fixtures/messages-response.json';
import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockToggles from '../fixtures/toggles-response.json';
import mockRecipients from '../fixtures/recipients-response.json';

class FolderLoadPage {
  foldersSetup = () => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockToggles).as(
      'featureToggle',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
    cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
      'folders',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/threads?*',
      mockMessages,
    ).as('inboxMessages');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
  };

  loadFolderMessages = (folderName, folderNumber, folderResponseIndex) => {
    this.foldersSetup();
    cy.intercept('GET', `/my_health/v1/messaging/folders/${folderNumber}*`, {
      data: mockFolders.data[folderResponseIndex],
    }).as('folderMetaData');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderNumber}/threads*`,
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

  getFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };

  verifyBackToMessagesButton = () => {
    cy.intercept('GET', '/my_health/v1/messaging/recipients*', mockRecipients);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging//folders/0/messages*',
      mockMessages,
    );

    cy.contains('Back to messages')
      .should('be.visible')
      .click({ force: true });
    cy.get('h1').should('contain', 'Messages');
  };

  navigateToLastPage = index => {
    cy.get('.usa-pagination__list li')
      .eq(index)
      .click();
  };

  verifyPaginationElements = () => {
    cy.get('.usa-pagination__list li').each(el => {
      cy.wrap(el).should('be.visible');
    });
  };
}

export default new FolderLoadPage();
