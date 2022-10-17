import mockMessage from './fixtures/message-response.json';
import mockCategories from './fixtures/categories-response.json';
import mockFolders from './fixtures/folder-response.json';
import mockMessages from './fixtures/messages-response.json';
import manifest from '../../manifest.json';

beforeEach(() => {
  window.dataLayer = [];
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'loop_pages', value: true }],
    },
  }).as('featureToggle');
});

describe.skip(manifest.appName, function() {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

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
    cy.injectAxe().axeCheck();
    cy.intercept('/v0/messaging/health/messages/*', mockMessage).as('message');
    cy.wait('@featureToggle');
    // https://staging-api.va.gov/v0/messaging/health/messages/2339331
    // class="composeSelect hydrated"
    cy.contains('General Inquiry').click();
    cy.wait('@message');

    // cy.wait('@message');
    // cy.get('[class="composeInput hydrated"]').get('[value="Doctor A"]').click();
  });
});
