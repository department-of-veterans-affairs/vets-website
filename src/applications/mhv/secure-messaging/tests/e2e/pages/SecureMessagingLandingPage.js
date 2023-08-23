import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockFolders from '../fixtures/generalResponses/folders.json';
import mockRecipients from '../fixtures/generalResponses/recipients.json';
import mockCategories from '../fixtures/generalResponses/categories.json';
import mockGeneralFolder from '../fixtures/generalResponses/generalFolder.json';

class SecureMessagingLandingPage {
  loadMainPage = () => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/user', mockUser).as('user');
    cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
      'folders',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients*',
      mockRecipients,
    ).as('recipients');
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
      mockGeneralFolder,
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

  verifyHeader = () => {
    cy.get('h1')
      .should('be.visible')
      .and('have.text', 'Messages');
  };
}

export default new SecureMessagingLandingPage();
