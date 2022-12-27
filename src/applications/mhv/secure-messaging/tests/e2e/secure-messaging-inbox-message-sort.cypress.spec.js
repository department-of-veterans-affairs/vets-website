import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';

describe(manifest.appName, () => {
  it('Sort Inbox Messages from Newest to Oldest', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('.sidebar-navigation-messages-list-header > a');
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')

      .should('contain', 'Newest');
    cy.get('.message-list-sort > va-button.hydrated').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('.sidebar-navigation-messages-list-header > a');
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('asc', { force: true })
      .should('contain', 'newest');
    cy.get('.message-list-sort > va-button.hydrated').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
