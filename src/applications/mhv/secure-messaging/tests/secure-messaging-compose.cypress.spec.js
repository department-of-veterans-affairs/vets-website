import mockCategories from './fixtures/categories-response.json';
import mockFolders from './fixtures/folder-response.json';
import mockMessages from './fixtures/messages-response.json';
import manifest from '../manifest.json';

beforeEach(() => {
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'loop_pages', value: true }],
    },
  }).as('featureToggle');
});

describe(manifest.appName, () => {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('can send message', () => {
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
    cy.injectAxe();
    cy.wait('@categories');
    cy.wait('@folders');
    cy.wait('@recipients');
    cy.injectAxe().axeCheck();
    cy.get('[data-testid="compose-message-link"]').click();
    cy.wait('@featureToggle');
    cy.get('[data-testid="compose-select"]')
      .shadow()
      .find('[id="select"]')
      .select('Doctor A');
    cy.get('[id="category-COVID"]').click();
    cy.get('[data-testid="message-subject-field"]').type('Test Subject');
    cy.get('[data-testid="message-body-field"]').type('message Test');
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
  });
});
