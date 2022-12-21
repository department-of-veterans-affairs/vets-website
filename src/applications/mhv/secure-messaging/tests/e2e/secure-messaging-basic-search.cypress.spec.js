import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  it('Basic Search Axe Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');
    cy.get('[data-testid="basic-search-submit"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Basic Search Drafts Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-2', mockMessages).as(
      'basicSearchRequestDrafts',
    );

    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('test');
    cy.contains('Drafts');
    cy.get('[data-testid="basic-search-submit"]').click();
    cy.get('[data-testid="highlighted-text"]').should('have.text', 'Test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
