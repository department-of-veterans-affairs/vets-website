import manifest from '../../manifest.json';
import PatientMessagesInboxPage from './pages/PatientMessagesInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  it('Basic Search Axe Check', () => {
    const landingPage = new PatientMessagesInboxPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');

    // there is no way to click the search button because it is inaccessible in the shadow dom...
    // cy.get('[id="va-search-button"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
