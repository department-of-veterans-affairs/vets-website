import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockFolders from '../fixtures/generalResponses/folders.json';
import mockRecipients from '../fixtures/generalResponses/recipients.json';
import mockCategories from '../fixtures/generalResponses/categories.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';
import mockGeneralMessages from '../fixtures/generalResponses/generalMessages.json';

class SecureMessagingLandingPage {
  loadMainPage = (
    user = mockUser,
    recipients = mockRecipients,
    messages = mockGeneralMessages,
  ) => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/user', user).as('user');
    cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
      'folders',
    );
    cy.intercept('GET', '/my_health/v1/messaging/recipients*', recipients).as(
      'recipients',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0',
      mockGeneralFolder,
    ).as('generalFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      messages,
    ).as('generalMessages');

    cy.visit('my-health/secure-messages/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggles');
    cy.wait('@user');
    cy.wait('@folders');
    cy.wait('@categories');
    cy.wait('@generalFolder');
  };

  verifyHeader = (text = 'Messages') => {
    cy.get('h1')
      .should('be.visible')
      .and('have.text', `${text}`);
  };
}

export default new SecureMessagingLandingPage();
