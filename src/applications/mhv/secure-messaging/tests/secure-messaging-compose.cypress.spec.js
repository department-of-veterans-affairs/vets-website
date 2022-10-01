import mockCategories from './fixtures/categories-response.json';
import mockFolders from './fixtures/folder-response.json';
import mockMessages from './fixtures/messages-response.json';

beforeEach(() => {
  window.dataLayer = [];
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'loop_pages', value: true }],
    },
  }).as('featureToggle');
});

describe('My First Cypress Test', function() {
  it('is test fine accessible', () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
    cy.intercept('GET', '/my_health/v1/messaging/folders', mockFolders).as(
      'folders',
    );
    cy.intercept('GET', '/my_health/v1/messaging/messages', mockMessages).as(
      'messages',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients',
      mockCategories,
    ).as('recipients');

    cy.visit('my-health/secure-messages/');
    cy.wait('@categories');
    cy.wait('@folders');
    // cy.wait('@messages');
    cy.wait('@recipients');
    cy.injectAxe().axeCheck();

    // https://staging-api.va.gov/v0/messaging/health/messages/2339331
    // class="composeSelect hydrated"
    cy.contains('Compose message').click();
    cy.wait('@featureToggle');
    // cy.get('[class="composeInput hydrated"]').get('[value="Doctor A"]').click();
    cy.get('[class="composeSelect hydrated"]')
      .shadow()
      .find('[id="select"]')
      .select('Doctor A');
    cy.get('[id="category-COVID"]').click();
    cy.get('[class="composeInput hydrated"]')
      .shadow()
      .find('[data-testid="message-subject-field"]')
      .type('Test Subject');
    cy.get('[id="message-body"]').type('message Test');
    cy.get('[class="send-button-bottom-text"]')
      .contains('Send')
      .click();
  });
});
