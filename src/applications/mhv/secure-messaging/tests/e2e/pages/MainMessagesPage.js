import mockFeatureToggles from '../fixtures/generalResponses/featureToggles.json';
import mockUser from '../fixtures/generalResponses/user.json';
import mockFolders from '../fixtures/generalResponses/folders.json';
import mockRecipients from '../fixtures/generalResponses/recipients.json';
import mockCategories from '../fixtures/generalResponses/categories.json';

class MainMessagesPage {
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
      '/my_health/v1/messaging/categories',
      mockCategories,
    ).as('categories');
  };
}

export default new MainMessagesPage();
