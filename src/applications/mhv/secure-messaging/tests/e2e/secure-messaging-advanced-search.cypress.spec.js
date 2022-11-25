import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from '../fixtures/messages-response.json';

beforeEach(() => {
  window.dataLayer = [];
});

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('Advanced Search Axe Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/search',
      mockMessages,
    ).as('advancedSearchRequest');
    cy.get('[data-testid="advanced-search-link"]').click();
    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid="advanced-search-submit"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
