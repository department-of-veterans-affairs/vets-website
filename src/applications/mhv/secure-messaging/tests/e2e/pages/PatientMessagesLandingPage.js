import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';

class PatientMessagesLandingPage {
  loadPage = (doAxeCheck = false) => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'loop_pages', value: true }],
      },
    }).as('featureToggle');
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
      '/my_health/v1/messaging/folders/*/messages',
      mockMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients',
      mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/');
    if (doAxeCheck) {
      cy.injectAxe();
    }
    cy.wait('@categories');
    cy.wait('@folders');
    cy.wait('@inboxMessages');
    cy.wait('@inboxFolderMetaData');
    cy.wait('@recipients');
    cy.wait('@featureToggle');
    if (doAxeCheck) {
      cy.axeCheck();
    }
  };
}

export default PatientMessagesLandingPage;
