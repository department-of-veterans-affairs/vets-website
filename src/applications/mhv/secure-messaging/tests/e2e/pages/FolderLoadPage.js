import mockMessages from '../fixtures/messages-response.json';
import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockToggles from '../fixtures/toggles-response.json';

class FolderLoadPage {
  loadInboxMessages = () => {
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
    cy.intercept('GET', '/my_health/v1/messaging/folders/0*', {
      data: mockFolders.data[0],
    }).as('inboxFolderMetaData');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
  };

  loadDraftMessages = () => {
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
    cy.intercept('GET', '/my_health/v1/messaging/folders/0*', {
      data: mockFolders.data[1],
    }).as('inboxFolderMetaData');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
    cy.get('[data-testid="drafts-sidebar"]').click();

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
  };

  loadSentMessages = () => {
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
    cy.intercept('GET', '/my_health/v1/messaging/folders/0*', {
      data: mockFolders.data[2],
    }).as('inboxFolderMetaData');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
    cy.get('[data-testid="sent-sidebar"]').click();

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
  };

  loadDeletedMessages = () => {
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
    cy.intercept('GET', '/my_health/v1/messaging/folders/0*', {
      data: mockFolders.data[3],
    }).as('inboxFolderMetaData');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
    cy.get('[data-testid="sent-sidebar"]').click();

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
  };

  getFolderHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };
}

export default FolderLoadPage;
