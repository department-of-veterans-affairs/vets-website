import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from '../fixtures/messages-response.json';

describe(manifest.appName, () => {
  it('Sort Inbox Messages from Newest to Oldest', () => {
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

    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('inquiry');

    cy.get('[data-testid="basic-search-submit"]').click();
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('desc', { force: true })
      .should('contain', 'Newest');
    cy.injectAxe();
    cy.axeCheck();
  });
});
